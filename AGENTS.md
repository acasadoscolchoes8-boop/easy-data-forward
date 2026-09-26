# Architecture Decisions

- Keep the Kinghost deployment as a separately generated static package in `dist-kinghost`; this preserves the Lovable/TanStack server deployment while supporting Apache hosting.
- Deploy Kinghost production only through the GitHub Actions FTP/FTPS workflow; credentials remain in GitHub secrets and never enter the repository.