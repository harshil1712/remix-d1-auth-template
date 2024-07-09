# Remix D1 Auth Demo

A template to quickly get started with an authenticated Remix application.

## Features

- [Remix](https://remix.run/): A modern and flexible framework for building web applications.
- [Cloudflare D1](https://www.cloudflare.com/en-gb/developer-platform/d1/): A fast and scalable serverless SQL database.
- [Prisma](https://www.prisma.io/): A powerful and type-safe ORM for database interactions.
- [Cloudflare Pages](https://www.cloudflare.com/en-gb/developer-platform/pages/): Efficient hosting with seamless deployment.
- GitHub Authentication: Pre-configured GitHub OAuth strategy for user authentication.
- Extensibility: Easily extendable to support other authentication providers.

## Getting Started

### Prerequisites

- Node.js
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/harshil1712/remix-d1-auth-template.git

cd remix-d1-auth-template
```

#### 2. Install dependencies

```sh
npm install
```

#### 3. Configure environment variables

Rename `.dev.vars.example` to `.dev.vars` and add the credentials. The file should look as follows:

```
GITHUB_CLIENT_ID="client_id"
GITHUB_CLIENT_SECRET="client_secret"
COOKIE_SESSION_SECRET="secret"
```

> Generate a new value for `COOKIE_SESSION_SECRET`

#### 4. Set up Cloudflare D1

Follow the [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/get-started/#3-create-a-database) to set up your database.

Once the database is created, add the bindings to `wrangler.toml` file.

```toml
[[d1_databases]]
binding = "DB"
database_name = "DATABASE_NAME"
database_id = "DATABASE_ID"
```

#### 5. Set up Prisma

Generate the Prisma client by running:

```sh
npx prisma generate
```

Apply database migrations,

Locally:

```sh
npx wrangler d1 migrations apply DATABASE_NAME --local
```

Remote (production):

```sh
npx wrangler d1 migrations apply DATABASE_NAME --remote
```

#### 6. Deploy to Cloudflar Pages

Follow the instructions on the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/) to deploy your Remix app.

### Running Locally

To run the application locallly:

```sh
npm run dev
```

## Extending Authentication

You can add support for other providers, or also add username and password auth mechanism to your app. To add other authentication providers (strategy):

### 1. Install the required package

```sh
npm install remix-auth-STRATEGY
```
> Find the list of all available at [this GitHub discussion](https://github.com/sergiodxa/remix-auth/discussions/111)

### 2. Update authentication strategy

Modiy the authentication strategy in `app/services/auth.server.ts`.

```ts
...
import {NewStrategy} from 'remix-auth-NEW_STRATEGY';

....

this.authenticator.use(new NewStrategy({
    // configurations
}, async ()=> {
    // insert into table
}))

```

### 3. Update environment variables

Add the necessary environment variables for the new provider to you `.dev.vars` file.

### 4. Update the table (optional)

Based on the new provider added, you might want to store some more information of the user. To do so, you need to update the table. Follow the instructions in the [Prisma documentation](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) to learn how to update the schema.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## Learn more

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)
- 📖 [Cloudflare D1](https://developers.cloudflare.com/d1/)
- 📖 [Prisma](https://www.prisma.io/docs/orm)
- 📖 [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- 📖 [Remix Auth](https://remix.run/resources/remix-auth)

> This README.md file was generated with the help of Chat-GPT.
