// Generates preview images without needing to store screenshots ourselves.
//
// Priority for any project/repo:
//   1. An explicit `image` you've set yourself (best quality, always wins)
//   2. An auto screenshot of the live deployed site, via microlink.io's
//      free screenshot API (no key required for this basic usage)
//   3. GitHub's own auto-generated social preview card for the repo
//
// These are all fetched client-side by the visitor's browser at runtime,
// not by this build — no API key or backend involvement needed.

export function liveScreenshot(url) {
  if (!url) return null;
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

export function repoSocialPreview(repoUrl) {
  if (!repoUrl) return null;
  try {
    const path = new URL(repoUrl).pathname; // "/owner/repo"
    return `https://opengraph.githubassets.com/1${path}`;
  } catch {
    return null;
  }
}

export function resolveProjectImage({ image, liveUrl, githubUrl }) {
  return image || liveScreenshot(liveUrl) || repoSocialPreview(githubUrl) || null;
}

export function resolveRepoImage(repo) {
  return liveScreenshot(repo.homepage) || repoSocialPreview(repo.url) || null;
}
