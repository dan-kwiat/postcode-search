# Postcode Search: API

## Installing

- `yarn`
- Install [Zeit Now CLI](https://zeit.co/download)

## Developing

- `cp .env-example .env` and fill in the missing values in `.env`
- `yarn start`

To get autocomplete suggestions for "ox":

`http://localhost:3000/api?query={postcodes{suggest(prefix:"ox"){id}}}`

## Deploying

Before deploying ensure that the environment variables listed in your `.env` file are also specified in `now.json`, and that the corresponding [Now secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets) are defined:

```bash
now secrets add t2s-postcodes-elastic-host <elastic-host>
now secrets add t2s-postcodes-elastic-username <elastic-username>
now secrets add t2s-postcodes-elastic-password <elastic-password>
```

Deploy to personal staging domain `https://postcode-search.your-name.now.sh`:

- `yarn deploy`

Deploy to production:

- `yarn deploy --prod`
