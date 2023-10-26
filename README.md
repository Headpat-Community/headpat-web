# The Headpat Website - NextJS 14

## How to contribute

You want to help? Great. Here's how you can do that:
Fork the repository, make your changes, and submit a pull request. If you don't know how to do that, [here's a guide](https://guides.github.com/activities/forking/).

## Code of Conduct

We work with short and simple rules:
Name the branch after the type of PR you're working on (e.g. `feature/feature-name` or `bugfix/bug-name`). This will help us to keep track of what's going on.

## How to run the website locally

First, install the dependencies:

```bash
npm install
```

#### After that, you need to rename `.env.example` to `.env` and fill in the values:

```env
DOMAIN_API_KEY=
NEXT_PUBLIC_DOMAIN_API=
```

The values are needed to access the API. You can get them by hosting your own Strapi Backend and creating an API key.

#### Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
