# SINFO WebApp

New SINFO webapp, made with Next.js. 

## Getting Started

- Clone project
- `yarn install` to install all dependencies
- `yarn dev` to run server (runs on port 3000 by default)

**Note:** Make sure you have an instance of cannon-api (including the authentication changes made to accomodate the new webapp) running on port 8090. You can get this version of cannon-api [here](https://github.com/sinfo/cannon-api/tree/new-webapp-auth-changes). In the future, once this version of cannon is merged to master (or staging), there won't be a need to run the cannon-api instance locally.

## Project Folder Structure

The following takes you through all the directories in the "src" directory and their intended usage:

### `app`

Stores all code related to the pages of the webapp, organized by directories.

Each directory in the "app" directory is mapped automatically to a route by Next.js (given that it contains a page.ts or route.ts file). For example, "app/contact/page.ts" maps to the route with path "/contact".

The "app/(root)/page.ts" maps to the route with path "/".

More on Next.js routing [here](https://nextjs.org/docs/app/building-your-application/routing).

### `assets`

Stores all static assets such as images, documents etc.

### `components`

Stores any reusable components, like buttons and UI components, that are not specific to any one page of the app and may be used throughout the application.

### `context`

Stores files related to Context API.

### `services`

Stores files related to data fetching, external API calls, etc.

### `styles`

Stores all project stylesheet files (CSS & SCSS files).

### `types`

Contains TypeScript type definitions.

***More directories may be added for efficient project organization on as-needed basis.***

## More on Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Youtube: The Net Ninja](https://youtube.com/playlist?list=PL4cUxeGkcC9jZIVqmy_QhfQdi6mzQvJnT)
