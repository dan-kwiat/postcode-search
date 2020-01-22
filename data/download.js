require('dotenv').config()
const fetch = require('node-fetch')
const unzipper = require('unzipper')
const getProgressBar = require('./lib/progress')
const log = require('./lib/logger')

const MB_TOTAL_ESTIMATE = 200
const MB_PROGRESS_STEP = 1

const downloadFile = async (url, path) => {
  log.info(`Downloading & unzipping NSPL data to '${path}'`)
  const res = await fetch(url)
  const progressBar = getProgressBar('Download Progress (MB)')
  progressBar.start(MB_TOTAL_ESTIMATE, 0)
  await new Promise((resolve, reject) => {
    res.body.pipe(unzipper.Extract({ path })).on("finish", () => {
      progressBar.update(MB_TOTAL_ESTIMATE)
      progressBar.stop()
      resolve()
    })
    let bytes = 0
    let i = 0
    res.body.on("data", chunk => {
      bytes += chunk.length
      const step = Math.floor(bytes/(1000000*MB_PROGRESS_STEP))
      if (step > i) {
        progressBar.update(Math.round(bytes/1000000))
        i = step
      }
    })
    res.body.on("error", (err) => {
      progressBar.stop()
      reject(err)
    })
  })
}

const zippedFileUrl = process.env.NSPL_ZIPPED_DATA_URL
const downloadDestination = process.env.NSPL_DOWNLOAD_DESTINATION

if (!zippedFileUrl) {
  log.error("Missing env variable 'NSPL_ZIPPED_DATA_URL'")
  process.exit(1)
}

if (!downloadDestination) {
  log.error("Missing env variable 'NSPL_DOWNLOAD_DESTINATION'")
  process.exit(1)
}

downloadFile(zippedFileUrl, downloadDestination)
