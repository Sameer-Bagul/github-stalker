const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function ensureProjectStructure(owner, repo) {
  // --- Screenshots folder ---
  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: "screenshots"
    });
  } catch (err) {
    if (err.status === 404) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "screenshots/.gitkeep",
        message: "chore: add screenshots folder",
        content: Buffer.from("\n").toString("base64"),
      });
      console.log(`✅ Created screenshots/ in ${repo}`);
    }
  }

  // --- project-meta.json ---
  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: ".project-meta.json"
    });
  } catch (err) {
    if (err.status === 404) {
      const meta = {
        title: repo,
        shortDescription: "Short project description here",
        tags: [],
        youtubeDemo: "",
        liveDemo: "",
        status: "active",
        featured: false
      };
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: ".project-meta.json",
        message: "chore: add project metadata",
        content: Buffer.from(JSON.stringify(meta, null, 2)).toString("base64"),
      });
      console.log(`✅ Added .project-meta.json in ${repo}`);
    }
  }
}

async function run() {
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    visibility: "all",
    per_page: 100
  });

  for (const r of repos) {
    console.log(`🔍 Checking ${r.name}...`);
    try {
      await ensureProjectStructure(r.owner.login, r.name);
    } catch (err) {
      console.log(`❌ Failed to update ${r.name}: ${err.message}`);
    }
  }
}

run().catch(console.error);