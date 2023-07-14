---
slug: hn-import-files
date: '2023-07-13T10:59:01'
title: "Report: JavaScript import maps are now supported cross-browser on Hackernews"
about: https://web.dev/import-maps-in-all-modern-browsers/
source: https://news.ycombinator.com/item?id=35800711
generator: claude
tags:
- hackernews
- summary
- claude
---

Here is a summary of the key sentiments and recommendations from the Hacker News comments on the post about JavaScript import maps:

## Positive Sentiment

- Import maps allow skipping the bundling step, which simplifies build pipelines. Some see this as a major win, especially when starting new projects.

- Import maps enable loading JavaScript modules natively without shims or build tools. This is seen as an improvement over previous solutions like RequireJS.

- For small projects, import maps provide good developer ergonomics by allowing bare imports without much tooling.

- Import maps help with code splitting and sharing libraries between different parts of an app. They provide more granular control over caching and updating compared to bundling everything.

- Rails 7 uses import maps by default, which avoids the need for a separate JS bundler. This simplification is appreciated. 

## Negative Sentiment

- Performance, security, and ergonomics of import maps do not seem as good as bundling in many cases. They require extra steps to match bundling benefits.

- Import maps feel like a compile-time only feature, contradicting the goal of avoiding toolchains. Manifest generation is still needed.

- Importing arbitrary URLs feels less secure than using subresource integrity with bundled scripts.

- More browser features were added to try to improve performance of import maps, but bundling still seems better optimized.

- The syntax does not feel intuitive and requires constantly looking up how to use it. It adds complexity compared to script tags.

## Recommendations

- Consider bundling for production use cases, at least optionally, to better optimize performance and security.

- Provide integrity hashes, bundle versioning, and other security measures when using CDNs and import maps.

- Improve documentation and guides on how to use import maps idiomatically and avoid common pitfalls.

- Bundle CSS along with JavaScript when using import maps to avoid extra network requests.

- Consider alternatives like module federation and single-spa for more complex module loading.

- polyfill import map support during transitional browser adoption period.