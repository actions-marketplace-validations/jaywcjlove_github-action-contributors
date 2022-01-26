import { setFailed, getInput, info } from '@actions/core';
import { getOctokit, context } from '@actions/github';

// InstanceType<typeof GitHub>

class Generator {
  token: string;
  owner: string;
  repo: string;
  constructor() {
    const { owner, repo } = context.repo;
    if (!repo) {
      setFailed(`repo name does not exist!`);
    }
    if (!owner) {
      setFailed(`owner name does not exist!`);
    }
    const myToken = getInput('token');
    if (!myToken) {
      setFailed(`token does not exist!`);
    }
    this.token = myToken;
    this.repo = repo;
    this.owner = owner;
    info(`owner/repo: \x1b[34m${owner}/${repo}\x1b[0m`);
  }
  async getContributors() {
    const octokit = getOctokit(this.token);
    const list = await octokit.request(`GET /repos/${this.owner}/${this.repo}/contributors`, {
      owner: this.owner,
      repo: this.repo
    });
    return list
  }
}

try {
  ;(async () => {
    const gen = new Generator();
    const list = await gen.getContributors();
    console.log(list)
  })();
} catch (error) {
  setFailed(error.message);
}