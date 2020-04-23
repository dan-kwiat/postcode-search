require('dotenv').config()
const fs = require('fs')
const { pipeline } = require('stream')
const fetch = require('node-fetch')
const getProgressBar = require('../../lib/progress')
const log = require('../../lib/logger')

const {
  LAD_DOWNLOAD_DESTINATION,
  LAD_BUC_DATA_URL,
  LAD_BUC_GEOJSON,
} = process.env

const MB_TOTAL_ESTIMATE = 1
const MB_PROGRESS_STEP = 0.1

const download = (url, path) => (
  new Promise(async (resolve, reject) => {
    if (!url) {
      reject('Missing data URL')
    }
    if (!path) {
      reject('Missing download destination')
    }

    let bytes = 0
    let i = 0
    let progressBar
    let res
    try {
      log.info(`Downloading local authority data to '${path}'`)
      res = await fetch(url)
      progressBar = getProgressBar('Download Progress (MB)')
      progressBar.start(MB_TOTAL_ESTIMATE, 0)
      res.body.on("data", chunk => {
        bytes += chunk.length
        const step = Math.floor(bytes/(1000000*MB_PROGRESS_STEP))
        if (step > i) {
          progressBar.update(Math.round(bytes/1000000))
          i = step
        }
      })
    } catch(e) {
      reject(e)
    }

    pipeline(
      res.body,
      fs.createWriteStream(path),
      (err) => {
        if (err) {
          reject(err)
        } else {
          progressBar.update(Math.round(bytes/1000000))
          progressBar.stop()
          resolve(bytes)
        }
      }
    )
  })
)

async function f() {
  try {
    log.info(`Creating download destination '${LAD_DOWNLOAD_DESTINATION}'`)
    await fs.promises.mkdir(LAD_DOWNLOAD_DESTINATION)
  } catch(e) {
    log.info('Destination already exists')
  }

  try {
    await download(
      LAD_BUC_DATA_URL,
      LAD_BUC_GEOJSON
    )
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

f()
