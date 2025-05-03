# Quotes FE

[![GitHub](https://img.shields.io/badge/GitHub-EvalVis/QuotesBE-black?style=flat&logo=github)](https://github.com/EvalVis/QuotesBE) - Check out the Backend

## Functionality
 1. View random quotes shown on the main page
 2. See comments on the quotes. Comments are shown from the most recent.
 3. Login to:
      - Save quotes you like. Your quotes are displayed from most recently liked.
      - Forget your saved quotes you don't like anymore
      - Exclude your saved quotes from being shown as random quotes.
      - Comment on the quotes. Your comments are shown at the top.

## Setup
This project uses Auth0 as authentication provider. The Quotes backend owner must setup the Auth0.

### Environment variables
For project to run, several env variables are needed to be setup.

**`VITE_AUTH0_DOMAIN`**
Address where client authentication requests will be routed. Provided by Quotes backend owner.
Already setup Auth0 domain: dev-wzfkg4o26oz6ndmt.us.auth0.com.
**`VITE_AUTH0_CLIENT_ID`**
Provided by Quotes backend owner.
Already setup Auth0 client id: v0YzxpAoJP6tLyW29TnZEuqStYkUF5fY.
**`VITE_AUTH0_USE_REFRESH_TOKENS`**
Boolean - determines if user would be automatically logged in again after the short lived token expires. Optional: default value is false.

You can control refresh tokens if quotes backend owner has them enabled.

Currently setup Auth0 has refresh tokens enabled, however you can still disable them in your own frontend app.
**`VITE_AUTH0_AUDIENCE`**
Provided by Quotes backend owner. The already running project has value: quotes.programmersdiary.com.
**`VITE_BE_URL`**
URL of the Backend service which hosts the quotes. Currently running BE has value: https://quotesapi.fly.dev.
### Running locally
```
npm install
npm run dev
```

## Testing
To run the tests without execute:
```
npm test
```
To run tests with coverage:
```
npm run coverage
```

[![codecov](https://codecov.io/github/EvalVis/QuotesFE/graph/badge.svg?token=R9X2SJQ259)](https://codecov.io/github/EvalVis/QuotesFE)

## Contributing
Contributions are welcome. To contribute:
1. Fork the repo.
2. Create a new branch.
3. Commit your changes.
4. Raise a pull request.

## Hosting
Simplest way to host is to use [<small>vercel.com</small>](https://vercel.com). It automatically detects app config and hosts the app on the cloud.


[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://quotes.programmersdiary.com/)