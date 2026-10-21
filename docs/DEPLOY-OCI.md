# OCI production deployment

The `master` push job in `.github/workflows/deploy-production.yml` runs the CI checks, transfers the checked-out source archive to OCI over SSH, builds the `date-planner` Compose stack, configures the host Nginx reverse proxy, and checks both health endpoints. Pull requests targeting `master` run verification only; they do not deploy.

## Before merging a release

1. Create a dedicated Ed25519 deployment key pair on a trusted workstation. Do not reuse the administrator key (`ssh.pem`).
2. Add only the public key to `/home/ubuntu/.ssh/authorized_keys` on OCI. Restrict the account/key to the deployment needs where practical, and confirm `ubuntu` can run the Docker commands used by the workflow with `sudo`.
3. Verify the SSH host key fingerprint from the OCI console or another trusted channel. Do not trust an unverified `ssh-keyscan` result.
4. In GitHub, open **Settings → Environments → production** (or **Settings → Secrets and variables → Actions**) and add these secrets:
   - `OCI_HOST`: `134.185.118.13`
   - `OCI_USER`: `ubuntu`
   - `OCI_SSH_KEY`: the dedicated private key, pasted directly into GitHub’s secret form
   - `OCI_KNOWN_HOSTS`: the verified known-hosts line for the OCI address
5. Open a pull request from `dev` to `master`. Wait for the `Verify` job to pass and review the change. Merging to `master` starts the production deployment.

Never commit `.env.production`, SSH keys, PostgreSQL passwords, or Kakao API keys. The first successful deployment creates `/opt/date-planner/.env.production` with a generated PostgreSQL password and file mode `0600`. Keep that file and the Compose volume when redeploying.

## OCI layout and ports

- `/opt/date-planner`: application and Compose files
- `date-planner` Compose project: PostgreSQL, API, and web containers
- PostgreSQL is reachable only on the Compose network; host port `5432` is not published
- Web container is bound to host loopback `127.0.0.1:8080`; host Nginx serves port `80` and proxies to it
- The existing MySQL service is not used or modified by this stack
- Nginx installation backs up the default site and aborts if it detects a custom default site

OCI network security rules must allow inbound SSH (`22`) for GitHub-hosted runners and HTTP (`80`) for visitors. For a PWA and production login, add HTTPS and a domain before enabling service-worker installation or Kakao login.

## Recovery

Inspect containers and logs on OCI:

```sh
cd /opt/date-planner
sudo docker compose -p date-planner --env-file .env.production -f compose.production.yaml ps
sudo docker compose -p date-planner --env-file .env.production -f compose.production.yaml logs --tail=200
```

A deployment can be retried from **Actions → Deploy production → Re-run jobs** after fixing the cause. Restore the Nginx backup at `/etc/nginx/sites-available/default.pre-date-planner` only if intentionally rolling back the site configuration. Do not remove the `date-planner` PostgreSQL volume to troubleshoot; that deletes stored database data.
