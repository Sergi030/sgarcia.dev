# personal-webpage

Personal blog built with [Astro](https://astro.build) and Tailwind CSS 4.

## Commands

| Command         | Action                                   |
| :-------------- | :--------------------------------------- |
| `npm run dev`   | Start dev server at `localhost:4321`     |
| `npm run build` | Build production site to `./dist/`       |
| `npm run preview` | Preview build locally before deploying |

## Writing a new post

Create a `.md` file in `src/content/blog/` with this frontmatter:

```markdown
---
title: "Post Title"
description: "A brief summary."
pubDate: "2026-04-07"
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

Push to `main` and GitHub Actions will deploy automatically.
