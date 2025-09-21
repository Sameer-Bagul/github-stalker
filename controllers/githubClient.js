const { Octokit } = require('@octokit/rest');

/**
 * GitHub API Client class for interacting with GitHub repositories.
 */
class GitHubClient {
  /**
   * Creates an instance of GitHubClient.
   * @param {string} token - GitHub personal access token for authentication.
   */
  constructor(token) {
    if (!token) {
      throw new Error('GitHub token is required');
    }
    this.octokit = new Octokit({ auth: token, log: { level: 'info' } });
  }

  /**
   * Checks the current rate limit status.
   * @returns {Promise<Object>} Rate limit information.
   */
  async checkRateLimit() {
    try {
      const response = await this.octokit.rateLimit.get();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check rate limit: ${error.message}`);
    }
  }

  /**
   * Fetches repositories for the authenticated user.
   * @returns {Promise<Array>} List of user repositories.
   */
  async fetchUserRepos() {
    try {
      const allRepos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const rateLimit = await this.checkRateLimit();
        if (rateLimit.resources.core.remaining === 0) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        const response = await this.octokit.repos.listForAuthenticatedUser({
          type: 'owner',
          sort: 'updated',
          per_page: 100,
          page
        });
        allRepos.push(...response.data);
        hasMore = response.data.length === 100;
        page++;
      }

      return allRepos;
    } catch (error) {
      throw new Error(`Failed to fetch user repositories: ${error.message}`);
    }
  }

  /**
   * Fetches details for a specific repository.
   * @param {string} owner - Repository owner username.
   * @param {string} repo - Repository name.
   * @returns {Promise<Object>} Repository details.
   */
  async fetchRepoDetails(owner, repo) {
    try {
      const rateLimit = await this.checkRateLimit();
      if (rateLimit.resources.core.remaining === 0) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const response = await this.octokit.repos.get({
        owner,
        repo
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repository details: ${error.message}`);
    }
  }

  /**
   * Fetches languages used in a specific repository.
   * @param {string} owner - Repository owner username.
   * @param {string} repo - Repository name.
   * @returns {Promise<Object>} Languages and their byte counts.
   */
  async fetchRepoLanguages(owner, repo) {
    try {
      const rateLimit = await this.checkRateLimit();
      if (rateLimit.resources.core.remaining === 0) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const response = await this.octokit.repos.listLanguages({
        owner,
        repo
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repository languages: ${error.message}`);
    }
  }

  /**
   * Fetches the README content for a specific repository.
   * @param {string} owner - Repository owner username.
   * @param {string} repo - Repository name.
   * @returns {Promise<string|null>} README content as string, or null if not found.
   */
  async fetchReadme(owner, repo) {
    try {
      const rateLimit = await this.checkRateLimit();
      if (rateLimit.resources.core.remaining === 0) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const response = await this.octokit.repos.getReadme({
        owner,
        repo
      });
      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      if (error.status === 404) {
        return null; // README not found
      }
      throw new Error(`Failed to fetch README: ${error.message}`);
    }
  }
}

module.exports = GitHubClient;