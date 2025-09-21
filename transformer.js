/**
 * Data transformer module for converting raw GitHub repository API data
 * into the portfolio JSON schema.
 */

/**
 * Transforms a single raw GitHub repository object into the portfolio schema.
 * @param {Object} rawRepo - The raw repository data from GitHub API.
 * @returns {Object} The transformed repository object in portfolio schema.
 */
function transformRepo(rawRepo) {
  if (!rawRepo || typeof rawRepo !== 'object') {
    throw new Error('Invalid raw repository data provided');
  }

  // Derive visibility from private boolean if visibility is not present
  const visibility = rawRepo.visibility || (rawRepo.private ? 'private' : 'public');

  return {
    id: rawRepo.id || null,
    name: rawRepo.name || null,
    full_name: rawRepo.full_name || null,
    visibility: visibility,
    is_private: rawRepo.private || false,

    description: rawRepo.description || null,
    long_description: null, // Not available in raw data

    topics: rawRepo.topics || [],
    tags: [], // Not available in raw data

    tech_stack: null, // Not available in raw data

    languages: null, // Not available in raw data

    media: null, // Not available in raw data

    links: {
      repo_url: rawRepo.html_url || null,
      homepage: rawRepo.homepage || null,
      live_demo: null, // Not available in raw data
      docs: null // Not available in raw data
    },

    stats: {
      stars: rawRepo.stargazers_count || 0,
      forks: rawRepo.forks_count || 0,
      watchers: rawRepo.watchers_count || 0,
      open_issues: rawRepo.open_issues_count || 0,
      last_updated: rawRepo.updated_at || null,
      created_at: rawRepo.created_at || null
    },

    owner: rawRepo.owner ? {
      username: rawRepo.owner.login || null,
      profile_url: rawRepo.owner.html_url || null,
      avatar: rawRepo.owner.avatar_url || null
    } : null,

    portfolio_flags: null // Not available in raw data
  };
}

/**
 * Transforms an array of raw GitHub repository objects into the portfolio schema.
 * @param {Array} rawRepos - Array of raw repository data from GitHub API.
 * @returns {Array} Array of transformed repository objects in portfolio schema.
 */
function transformRepos(rawRepos) {
  if (!Array.isArray(rawRepos)) {
    throw new Error('Invalid raw repositories data: expected an array');
  }

  return rawRepos.map(transformRepo);
}

module.exports = {
  transformRepo,
  transformRepos
};