# LegalDraft AI

Generate professional legal documents using AI. Monorepo with Next.js web and Express API.

## Apps

- apps/web — Next.js 14, TailwindCSS
- apps/server — Express API (OpenAI, Stripe)

## Quick Start

1. Copy env examples and fill keys:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

2. Install deps and run dev:

```bash
pnpm install
pnpm --filter legaldraft-server dev
pnpm --filter legaldraft-web dev
```

3. Open web at http://localhost:3001. Set `NEXT_PUBLIC_API_BASE` to your server URL.

## Environment Variables

See `.env.example` files in each app. Required: `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`.

## Features

- Email/Google auth (placeholder via Clerk integration planned)
- Template library (seeded in memory)
- AI generation (OpenAI chat completions)
- Export to PDF/DOCX
- Stripe checkout and portal endpoints

<a href="https://ph.heroui.chat?utm_source=https://github.com/heroui-inc/heroui&utm_medium=banner">
  <img alt="HeroUI Chat on Product Hunt" src="https://heroui-chat-assets.nyc3.cdn.digitaloceanspaces.com/github_banner-round.png">
</a>

<br/>
<br/>

<p align="center">
  <a href="https://heroui.com">
      <img width="20%" src="https://raw.githubusercontent.com/heroui-inc/heroui/main/apps/docs/public/isotipo.png" alt="heorui" />
      <h1 align="center">HeroUI</h1>
  </a>
</p>
</br>
<p align="center">
  <a href="https://github.com/heroui-inc/heroui/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@heroui/react?style=flat" alt="License">
  </a>
  <a href="https://codecov.io/gh/jrgarciadev/nextui">
    <img src="https://codecov.io/gh/jrgarciadev/nextui/branch/main/graph/badge.svg?token=QJF2QKR5N4" alt="codecov badge">
  </a>
  <!-- <a href="https://github.com/heroui-inc/heroui/actions/workflows/main.yaml">
    <img src="https://github.com/heroui-inc/heroui/actions/workflows/main.yaml/badge.svg" alt="CI/CD heroui">
  </a> -->
  <a href="https://www.npmjs.com/package/@heroui/react">
    <img src="https://img.shields.io/npm/dm/@heroui/react.svg?style=flat-round" alt="npm downloads">
  </a>
</p>

## Getting Started

Visit <a aria-label="heroui learn" href="https://heroui.com/learn">https://heroui.com/guide</a> to get started with HeroUI.

## Documentation

Visit [https://heroui.com/docs](https://heroui.com/docs) to view the full documentation.

## Storybook

Visit [https://storybook.heroui.com](https://storybook.heroui.com/) to view the storybook for all components.

## Canary Release

Canary versions are available after every merge into `canary` branch. You can install the packages with the tag `canary` in npm to use the latest changes before the next production release.

- [Documentation](https://canary.heroui.com/docs)
- [Storybook](https://canary-sb.heroui.com)

## Community

We're excited to see the community adopt HeroUI, raise issues, and provide feedback.
Whether it's a feature request, bug report, or a project to showcase, please get involved!

- [Discord](https://discord.gg/9b6yyZKmH4)
- [X](https://x.com/hero_ui)
- [GitHub Discussions](https://github.com/heroui-inc/heroui/discussions)

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](https://github.com/heroui-inc/heroui/blob/main/CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [CODE_OF_CONDUCT](https://github.com/heroui-inc/heroui/blob/main/CODE_OF_CONDUCT.md).

## License

[MIT](https://choosealicense.com/licenses/mit/)
