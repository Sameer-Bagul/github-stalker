#!/usr/bin/env node

require('dotenv').config();

const { Command } = require('commander');
const GitHubClient = require('./githubClient');
const { transformRepos } = require('./transformer');
const Enricher = require('./enricher');
const OutputHandler = require('./outputHandler');

const program = new Command();

program
  .name('github-stalker')
  .description('CLI tool to generate portfolio data from GitHub repositories')
  .version('1.0.0');

program
  .argument('<username>', 'GitHub username to fetch repositories for')
  .option('-o, --output <type>', 'output type: console or file', 'console')
  .option('-f, --file <filename>', 'output filename (required if output is file)')
  .option('-t, --token <token>', 'GitHub personal access token (can also use GITHUB_TOKEN env var)')
  .action(async (username, options) => {
    try {
      // Get token from option or env
      const token = options.token || process.env.GITHUB_TOKEN;
      if (!token) {
        throw new Error('GitHub token is required. Provide via --token option or GITHUB_TOKEN environment variable.');
      }

      console.log(`Fetching repositories for user: ${username}`);

      // Initialize components
      const githubClient = new GitHubClient(token);
      const enricher = new Enricher(githubClient);

      // Fetch raw repositories
      const rawRepos = await githubClient.fetchUserRepos(username);
      console.log(`Fetched ${rawRepos.length} repositories`);

      // Transform repositories
      const transformedRepos = transformRepos(rawRepos);
      console.log('Transformed repositories');

      // Enrich repositories
      const enrichedRepos = await enricher.enrichRepos(transformedRepos);
      console.log('Enriched repositories with additional data');

      // Output results
      await OutputHandler.output(enrichedRepos, options);
      console.log('Portfolio data generated successfully');

    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();