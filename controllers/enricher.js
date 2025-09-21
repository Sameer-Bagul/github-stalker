const GitHubClient = require('./githubClient');

/**
 * Data enricher module for enhancing portfolio repository objects with additional data
 * fetched from GitHub API, including languages, README content, tech stack derivation,
 * media links, and portfolio flags.
 */
class Enricher {
  /**
   * Creates an instance of Enricher.
   * @param {GitHubClient} githubClient - Instance of GitHubClient for API calls.
   */
  constructor(githubClient) {
    if (!(githubClient instanceof GitHubClient)) {
      throw new Error('Invalid GitHubClient instance provided');
    }
    this.githubClient = githubClient;
  }

  /**
   * Enriches a single portfolio repository object with additional data.
   * @param {Object} repo - The portfolio repository object from transformer.
   * @returns {Promise<Object>} The enriched repository object.
   */
  async enrichSingleRepo(repo) {
    if (!repo || typeof repo !== 'object') {
      throw new Error('Invalid repository object provided');
    }

    try {
      const enriched = { ...repo };

      // Fetch languages
      const languages = await this._fetchLanguages(repo);
      enriched.languages = languages;

      // Fetch README for long_description
      const readme = await this._fetchReadme(repo);
      enriched.long_description = readme;

      // Derive tech_stack from languages and topics
      enriched.tech_stack = this._deriveTechStack(languages, repo.topics);

      // Derive tags from topics
      enriched.tags = this._deriveTags(repo.topics);

      // Enrich media
      enriched.media = await this._enrichMedia(repo);

      // Set portfolio_flags
      enriched.portfolio_flags = this._setPortfolioFlags(repo);

      return enriched;
    } catch (error) {
      // Return original repo with minimal enrichment on error
      return {
        ...repo,
        languages: null,
        long_description: null,
        tech_stack: null,
        tags: [],
        media: null,
        portfolio_flags: this._setPortfolioFlags(repo) // Still set flags even on error
      };
    }
  }

  /**
   * Enriches an array of portfolio repository objects.
   * @param {Array} repos - Array of portfolio repository objects from transformer.
   * @returns {Promise<Array>} Array of enriched repository objects.
   */
  async enrichRepos(repos) {
    if (!Array.isArray(repos)) {
      throw new Error('Invalid repositories array provided');
    }

    const enrichedRepos = [];
    for (const repo of repos) {
      const enriched = await this.enrichSingleRepo(repo);
      enrichedRepos.push(enriched);
    }
    return enrichedRepos;
  }

  /**
   * Fetches languages for the repository.
   * @private
   * @param {Object} repo - Repository object.
   * @returns {Promise<Object|null>} Languages object or null on error.
   */
  async _fetchLanguages(repo) {
    try {
      const [owner, name] = repo.full_name.split('/');
      return await this.githubClient.fetchRepoLanguages(owner, name);
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetches README content for long_description.
   * @private
   * @param {Object} repo - Repository object.
   * @returns {Promise<string|null>} README content or null.
   */
  async _fetchReadme(repo) {
    try {
      const [owner, name] = repo.full_name.split('/');
      return await this.githubClient.fetchReadme(owner, name);
    } catch (error) {
      return null;
    }
  }

  /**
   * Derives tech_stack from languages and topics.
   * @private
   * @param {Object} languages - Languages object.
   * @param {Array} topics - Array of topics.
   * @returns {Object} Tech stack object.
   */
  _deriveTechStack(languages, topics) {
    const techStack = {
      frontend: [],
      backend: [],
      database: [],
      tools: []
    };

    // Language mappings
    const langMappings = {
      frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Vue', 'Angular', 'Svelte'],
      backend: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', 'Rust'],
      database: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis'],
      tools: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GitHub Actions', 'Jenkins']
    };

    // Add from languages
    if (languages) {
      Object.keys(languages).forEach(lang => {
        for (const category in langMappings) {
          if (langMappings[category].includes(lang)) {
            if (!techStack[category].includes(lang)) {
              techStack[category].push(lang);
            }
          }
        }
      });
    }

    // Add from topics
    if (topics) {
      const topicMappings = {
        frontend: ['react', 'vue', 'angular', 'frontend', 'ui', 'ux'],
        backend: ['node', 'express', 'django', 'flask', 'spring', 'backend', 'api'],
        database: ['mongodb', 'postgres', 'mysql', 'sqlite', 'database'],
        tools: ['docker', 'aws', 'azure', 'ci-cd', 'github-actions', 'deployment']
      };

      topics.forEach(topic => {
        for (const category in topicMappings) {
          if (topicMappings[category].includes(topic.toLowerCase())) {
            // Map topic to tech
            const techMap = {
              'react': 'React',
              'vue': 'Vue.js',
              'angular': 'Angular',
              'node': 'Node.js',
              'express': 'Express.js',
              'mongodb': 'MongoDB',
              'postgres': 'PostgreSQL',
              'mysql': 'MySQL',
              'docker': 'Docker',
              'aws': 'AWS',
              'azure': 'Azure'
            };
            const tech = techMap[topic.toLowerCase()] || topic;
            if (!techStack[category].includes(tech)) {
              techStack[category].push(tech);
            }
          }
        }
      });
    }

    return techStack;
  }

  /**
   * Derives tags from topics.
   * @private
   * @param {Array} topics - Array of topics.
   * @returns {Array} Array of tags.
   */
  _deriveTags(topics) {
    if (!topics || !Array.isArray(topics)) return [];
    return topics.map(topic => topic.charAt(0).toUpperCase() + topic.slice(1));
  }

  /**
   * Enriches media information.
   * @private
   * @param {Object} repo - Repository object.
   * @returns {Promise<Object>} Media object.
   */
  async _enrichMedia(repo) {
    const media = {
      screenshots: [],
      video_demo: null
    };

    try {
      const [owner, name] = repo.full_name.split('/');
      // Check for screenshots folder
      const screenshots = await this._fetchScreenshots(owner, name);
      media.screenshots = screenshots;
    } catch (error) {
      // Ignore media fetch errors
    }

    return media;
  }

  /**
   * Fetches screenshots from the repository.
   * @private
   * @param {string} owner - Owner username.
   * @param {string} repo - Repo name.
   * @returns {Promise<Array>} Array of screenshot URLs.
   */
  async _fetchScreenshots(owner, repo) {
    try {
      const response = await this.githubClient.octokit.repos.getContent({
        owner,
        repo,
        path: 'screenshots'
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter(file => file.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(file.name))
          .map(file => file.download_url);
      }
    } catch (error) {
      // Skip gracefully without logging API errors
    }
    return [];
  }

  /**
   * Sets portfolio flags based on repository criteria.
   * @private
   * @param {Object} repo - Repository object.
   * @returns {Object} Portfolio flags object.
   */
  _setPortfolioFlags(repo) {
    const stars = repo.stats.stars || 0;
    const isPrivate = repo.is_private || false;

    const featured = stars > 20;
    const priority = Math.min(Math.max(Math.floor(stars / 10) + 1, 1), 5);
    const showInPortfolio = !isPrivate || stars > 0;

    // Simple color based on priority
    const colors = ['#6B7280', '#9CA3AF', '#D1D5DB', '#F59E0B', '#10B981', '#2563EB'];
    const highlightColor = colors[priority - 1] || '#2563EB';

    return {
      featured,
      priority,
      show_in_portfolio: showInPortfolio,
      highlight_color: highlightColor
    };
  }
}

module.exports = Enricher;