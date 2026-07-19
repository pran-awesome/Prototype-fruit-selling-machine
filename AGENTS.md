# AGENTS.md

## Cursor Cloud specific instructions

### Current repository state

As of this writing, this repository is an empty placeholder. It contains only
`README.md` (title: `Prototype-fruit-selling-machine`) with no application code,
no dependency manifests, no build tooling, no services, and no tests.

Because of this, there is currently **nothing to install, build, run, or test**.
Standard commands (lint/test/build/run) do not exist yet.

### When application code is added

Re-evaluate the development setup once real code lands (e.g. a `package.json`,
`requirements.txt`, `pyproject.toml`, `go.mod`, etc. appears). At that point,
update the environment update script to install the chosen stack's dependencies,
and document the actual lint/test/build/run commands here.

### Available base tooling on the Cloud VM

The VM already provides these toolchains, so choosing any of these stacks needs
no extra system-dependency installation:

- Node.js v22 (with `npm` and `pnpm`)
- Python 3.12 (with `pip`)
- Go 1.22
- Java (OpenJDK 21)
- Git

Note: the Docker CLI is present but the Docker daemon is not running by default.
