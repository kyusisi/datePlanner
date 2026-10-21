# Repository workflow

- Remote repository: https://github.com/kyusisi/datePlanner.git
- Keep commits focused on one feature, fix, or configuration concern. Do not split every individual function into a separate commit or bundle unrelated work together.
- Use descriptive Conventional Commit messages, such as `feat(api): add health endpoints` or `fix(web): handle API errors`.
- Inspect Git status and existing changes before editing or committing. Preserve unrelated user work.
- Run checks relevant to each change and report checks blocked by environment limitations accurately.
- Never commit `.env`, credentials, `node_modules`, build outputs, generated Prisma Client, or local caches. Commit `.env.example` and `pnpm-lock.yaml`.
- Preserve remote history. Do not force-push or rewrite published commits without explicit user authorization.
