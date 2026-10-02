<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the portfolio as one TanStack Start index route with anchor-based sections; this preserves smooth one-page navigation on the project's existing router.
- Keep editable portfolio content in `src/data/` and browser-only contact delivery via mailto; the requested site has no backend.
- Keep the portfolio's visual tokens and section-level theme overrides in `src/styles.css`; Tailwind v4 reads CSS tokens rather than a config file, and a central theme keeps the page consistent.
