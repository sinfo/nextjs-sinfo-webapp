# SINFO WebApp

New SINFO webapp, made with Next.js. 

## Getting Started

- Clone project
- `yarn install` to install all dependencies
- `yarn dev` to run server (runs on port 3000 by default)

## Project Folder Structure

The following takes you through all the directories in the "src" directory and their intended usage:

### `app`

Stores all code related to the pages of the webapp, organized by folders.

Each directory in the "app" directory is mapped automatically to a route by Next.js (given that it contains a page.js file). For example, "app/contact/page.js" maps to the route with path "/contact".

The "app/(root)/page.js" maps to the route with path "/".

More on Next.js routing [here](https://nextjs.org/docs/app/building-your-application/routing).

### `assets`

Stores all static assets such as images, documents etc.

### `components`

Stores any reusable components, like buttons and UI components, that are not specific to any one page of the app and may be used throughout the application.

### `hooks`

Stores custom hooks that are not specific to any one page and may be used throughout the application.

### `styles`

Stores all project stylesheet files (CSS & SCSS files).

### `utils`

Stores any utility/helper functions that may be used throughout the application.

***More directories may be added for efficient project organization on as-needed basic.***

## More on Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Youtube: The Net Ninja](https://youtube.com/playlist?list=PL4cUxeGkcC9jZIVqmy_QhfQdi6mzQvJnT)
