# Deploying MERIDIAN to GitHub Pages (leverage1628.github.io/meridian)

The file `index.html` in this package IS the deployable site (v55, single file, no dependencies).

## First-time setup (browser or GitHub mobile app)
1. Go to github.com -> New repository -> name it exactly: `meridian` (public).
2. In the new repo: "Add file" -> "Upload files" -> upload `index.html` -> Commit.
3. Repo Settings -> Pages -> Source: "Deploy from a branch" -> Branch: `main`, folder `/ (root)` -> Save.
4. Wait ~1-2 minutes. The site is live at: https://leverage1628.github.io/meridian/

## Updating to a new version (every future build)
1. Build or receive the new single file (e.g. indexV56.html).
2. Rename it to `index.html`.
3. In the repo: open index.html -> pencil/replace via "Upload files" (same name overwrites) -> Commit.
4. Pages redeploys automatically in ~1 minute. Hard-refresh on your phone to bust cache.

## Optional (recommended once)
- Also upload `db.json`, `shell.html`, `build.js`, `guard.js`, `rollweek.js`, `README-build.md` to the repo.
  They don't affect the site, but they version-control the build system alongside the deliverable.

## Notes
- No build step is needed on GitHub's side - it just serves the file.
- The site is public. Everything in the dashboard will be visible to anyone with the link.
