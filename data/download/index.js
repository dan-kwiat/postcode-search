require('dotenv').config()
const fetch = require('node-fetch')
const unzipper = require('unzipper')
const getProgressBar = require('../lib/progress')
const log = require('../lib/logger')

const MB_TOTAL_ESTIMATE = 200
const MB_PROGRESS_STEP = 1

const downloadUnzip = async (url, path) => {
  if (!url) {
    throw new Error('Missing zipped data URL')
  }
  if (!path) {
    throw new Error('Missing download destination')
  }
  log.info(`Downloading & unzipping NSPL data to '${path}'`)
  const res = await fetch(url)
  const progressBar = getProgressBar('Download Progress (MB)')
  progressBar.start(MB_TOTAL_ESTIMATE, 0)
  await new Promise((resolve, reject) => {
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
    
    const unzipStream = res.body.pipe(unzipper.Extract({ path }))
    unzipStream.on("finish", () => {
      progressBar.update(MB_TOTAL_ESTIMATE)
      progressBar.stop()
      resolve()
    })
    unzipStream.on("error", err => {
      log.error('Encountered error in unzip stream: ')
      reject(err)
    })
  })
}


async function f() {
  try {
    await downloadUnzip(
      process.env.NSPL_ZIPPED_DATA_URL,
      process.env.NSPL_DOWNLOAD_DESTINATION
    )
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

f()
