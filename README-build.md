# MERIDIAN build system (introduced v55)
Single-file deliverable, now produced from split sources.

- **db.json** — all 55 theater records (data only). Edit here.
- **shell.html** — engine, boards, CSS, UI (no data). Edit here for features.
- **guard.js** — validation suite (structure, sparkline sync, coords, pipeline stages, refs, cited-history standard, mojibake). Runs automatically before every build; build refuses on errors.
- **build.js** — `node build.js indexV56.html` merges db.json into shell.html.
- **rollweek.js** — weekly window roll. Now targets db.json: `node rollweek.js db.json W17` then rebuild.

Workflow: edit db.json and/or shell.html -> `node build.js indexVNN.html` -> ship the single file.
