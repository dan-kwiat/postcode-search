# Postcode Search: API

## Installing

- `yarn`
- Install [Zeit Now CLI](https://zeit.co/download)

## Developing

- `cp .env-example .env` and set appropriate values in `.env`
- `yarn start`

To search for "ox": `http://localhost:3000/api/?variables={"q":"ox"}`

## Deploying

Before deploying for the first time ensure the environment variables are defined as [Now secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets):

```bash
now secrets add t2s-postcodes-elastic-host <elastic-host>
now secrets add t2s-postcodes-elastic-username <elastic-username>
now secrets add t2s-postcodes-elastic-password <elastic-password>
now secrets add t2s-postcodes-elastic-index <elastic-index>
```

Deploy to subdomain of `now.sh`:

- yarn deploy
