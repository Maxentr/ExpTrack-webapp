# ExpTrack

ExpTrack is a web application for school that allows you to track your expenses. You can have groups of friends to share expenses with, and you can add expenses to these groups. You can also add friends to your groups.

## Technical choices

### Metaframework

I choose to use [Next.js](https://nextjs.org/) for the frontend because it allows me to use React and to have a server-side rendering.

### Styling

I use [TailwindCSS](https://tailwindcss.com/) for the styling because it is a CSS framework that I like and that I am familiar with. It allows me to build a responsive website easily. On top of TailwindCSS I use [shadcn/ui](https://ui.shadcn.com/) components library (build with [radixUI](https://www.radix-ui.com/)).

### Others

To validate form I use [react-hook-form](https://react-hook-form.com/) and [zod](https://zod.dev/). I use [swr](https://swr.vercel.app/) to fetch data and [pnpm](https://pnpm.io/) as package manager.

## Installation

### Prerequisites

| Name                              | Version  |
| --------------------------------- | -------- |
| [Node.js](https://nodejs.org/en/) | v18.12.0 |
| [pnpm](https://pnpm.io/)          | v8.4.0   |

### Environment variables

Copy and rename `.env.example` to `.env.local` and fill the variables.

### Install dependencies

```bash
pnpm install
```

### Run the app

```bash
pnpm dev
```

## How to use it

See the [documentation](./HOWTO.md).

## Bug

- All forwardRef/ref error comes from radixUI and shadcn/ui
- className did not match error comes from Next.js
