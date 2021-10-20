# Postcode Search: Data

## Requirements

- Node v10
- Yarn

## Installing

- `yarn`
- `cp .env-example .env` and fill in missing values in `.env`

## Postcodes

```bash
# Download & unzip
yarn postcode-download

# Upload to Elasticsearch
yarn postcode-upload
```

## Local Authority Districts

```bash
# Download
yarn lad-download

# Upload to Elasticsearch
yarn lad-upload
```

## Updating

- Find the latest Postcodes / LAD data pages on
  https://geoportal.statistics.gov.uk/
- Right-click _Download_ > Copy link address, then paste it as the value of
  `NSPL_ZIPPED_DATA_URL` or `LAD_BUC_DATA_URL` in the `.env` file.
- Update the value of `NSPL_DOWNLOAD_DESTINATION` or `LAD_DOWNLOAD_DESTINATION`
  in `.env`.
- Run `yarn postcode-download` or `yarn lad-download`.
- Update the file names in `.env` to reflect the files created by the download
  scripts.
- Update `ELASTIC_POSTCODES_INDEX` or `ELASTIC_LAD_INDEX` in `.env` to a new
  index name that doesn't yet exist.
- Run `yarn postcode-upload` or `yarn lad-upload`.
