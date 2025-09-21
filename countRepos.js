// repoStats.js
const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getRepoStats(username) {
  let page = 1;
  const perPage = 100;
  let repos = [];

  // Fetch all repos
  while (true) {
    const response = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      per_page: perPage,
      page,
    });

    repos = repos.concat(response.data);

    if (response.data.length < perPage) break;
    page++;
  }

  // Filter repos owned by you
  const owned = repos.filter((r) => r.owner.login === username);

  const stats = {
    total: owned.length,
    forks: owned.filter((r) => r.fork).length,
    nonForks: owned.filter((r) => !r.fork).length,
    public: owned.filter((r) => r.private === false).length,
    private: owned.filter((r) => r.private === true).length,
    archived: owned.filter((r) => r.archived === true).length,
    active: owned.filter((r) => r.archived === false).length,
  };

  console.log("GitHub Repo Stats for", username);
  console.log("===================================");
  console.log(`Total repos owned: ${stats.total}`);
  console.log(`- Forks: ${stats.forks}`);
  console.log(`- Non-forks: ${stats.nonForks}`);
  console.log(`Public repos: ${stats.public}`);
  console.log(`Private repos: ${stats.private}`);
  console.log(`Archived repos: ${stats.archived}`);
  console.log(`Active repos: ${stats.active}`);
}

getRepoStats("Sameer-Bagul").catch((err) => console.error(err));
