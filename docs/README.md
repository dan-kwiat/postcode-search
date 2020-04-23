# GeoGQL App (Web + API)


## Requirements

- Node
- Yarn


## Installing

```bash
yarn
```


## Developing

```bash
cp .env-example .env
# Edit contents of .env to set development environment variables
# These are only accessible to the API route

yarn dev
```


## Deploying

- Install [Vercel Now CLI](https://vercel.com/download): `yarn global add now`
- Set Preview / Production [environment variables in Vercel](https://vercel.com/docs/v2/build-step#environment-variables) (use the same variable names defined in [.env](./.env))


```bash
# Deploy to personal staging domain
yarn deploy:preview

# Or production
yarn deploy:production
```
