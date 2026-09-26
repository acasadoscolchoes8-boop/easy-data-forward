# Architecture Decisions

- Keep the Kinghost deployment as a separately generated static package in `dist-kinghost`; this preserves the Lovable/TanStack server deployment while supporting Apache hosting.
- The standard Lovable build writes the same validated static export to `dist`; Lovable's deployment check requires that directory.
- Deploy Kinghost production only through the GitHub Actions FTP/FTPS workflow, targeting `/www/` by default and verifying every public route afterward; credentials remain in GitHub secrets and never enter the repository.
- Generate `dist` before starting the local static server; this prevents the preview from falling back to a stale application when generated pages are absent.
- Serve preview HTML without browser caching and clear the preview cache on navigation; this prevents obsolete Vite modules from a previous project version from executing.