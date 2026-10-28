# Anniversary website 💖

## Deploy to GitHub Pages

1. Create a GitHub repository named `anniversary`.
2. Upload the **contents** of this folder to the repository root (so `package.json`, `index.html`, `src/`, and `.github/` are at the top level).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Open **Actions** and wait for the “Deploy anniversary website to GitHub Pages” workflow to finish successfully.
6. The expected URL is `https://ducanhtrn-dev.github.io/anniversary/` if the repository owner/name match the screenshot.

If you use a repository name other than `anniversary`, update `base` in `vite.config.js` to `/<repository-name>/` before uploading.

## Run locally

Install Node.js 20 or newer, then run:

```bash
npm install
npm run dev
```
