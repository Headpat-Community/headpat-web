# Headpat.Place - Next.js 15

## How to contribute

You want to help? Great. Here's how you can do that: Fork the repository, make your changes, and submit a pull request.
If you don't know how to do that, [here's a guide](https://guides.github.com/activities/forking/).

## Code of Conduct

We work with short and simple rules: Name the branch after the type of PR you're working on (e.g. `feat/feature-name`
or `fix/bug-name`). This will help us to keep track of what's going on.

## How to run the website locally

First, install bun:

```bash
macOS/Linux: curl -fsSL https://bun.com/install | bash
Windows: powershell -c "irm bun.sh/install.ps1|iex"
```

Now, install the packages:

```bash
bun install
```

### NOTE:

Some pages require API Keys to work. If you require an API Key, please contact Faye at faye@headpat.place.
In the future, I will setup a docker compose so you can use the backend locally.

#### Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying the homepage. The page auto-updates as you edit the file.
