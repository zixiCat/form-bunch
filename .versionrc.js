/**
 * The following is the devDependency needed and you can also install it directly by using,
 * yarn add --dev standard-version
 * */
const settings = require(process.cwd() + "/package.json");

module.exports = {
  header: `# Changelog

All notable changes to this project will be documented in this file.
`,
  types: [
    {type: "feat", section: "Features"},
    {type: "fix", section: "Bug Fixes"},
    {type: "chore", hidden: true},
    {type: "docs", hidden: true},
    {type: "style", hidden: true},
    {type: "refactor", hidden: true},
    {type: "perf", hidden: true},
    {type: "test", hidden: true},
  ],
  commitUrlFormat: settings.homepage + "/commit/{{hash}}",
  compareUrlFormat:
    settings.homepage + "/compare/{{previousTag}}...{{currentTag}}",
  issueUrlFormat: settings.homepage + "/issues/{{id}}",
  userUrlFormat: settings.homepage + "",
  releaseCommitMessageFormat: "v{{currentTag}}",
};
