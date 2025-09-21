#!/usr/bin/env node

require('dotenv').config();

const { Command } = require('commander');
const GitHubClient = require('./controllers/githubClient');
const { transformRepos } = require('./models/transformer');
const Enricher = require('./controllers/enricher');
const OutputHandler = require('./views/outputHandler');

const program = new Command();

program
  .name('github-stalker')
  .description('CLI tool to generate portfolio data from GitHub repositories')
  .version('1.0.0');

program
  .option('-t, --token <token>', 'GitHub personal access token (can also use GITHUB_TOKEN env var)')
  .action(async (options) => {
    try {
      // Get username from env
      const username = process.env.USER;
      if (!username) {
        throw new Error('USER environment variable is required.');
      }

      // Get token from option or env
      const token = options.token || process.env.GITHUB_TOKEN;
      if (!token) {
        throw new Error('GitHub token is required. Provide via --token option or GITHUB_TOKEN environment variable.');
      }

      // Initialize components
      const githubClient = new GitHubClient(token);
      const enricher = new Enricher(githubClient);

      // Fetch raw repositories
      const rawRepos = await githubClient.fetchUserRepos();

      // Transform repositories
      const transformedRepos = transformRepos(rawRepos);

      // Enrich repositories
      const enrichedRepos = await enricher.enrichRepos(transformedRepos);

      // Output results
      await OutputHandler.output(enrichedRepos);

    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();