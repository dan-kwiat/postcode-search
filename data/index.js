require('dotenv').config()
const streamBatchPromise = require('stream-batch-promise')
const createCsvStream = require('./lib/csv-stream')
const log = require('./lib/logger')
const getProgressBar = require('./lib/progress')
const esClient = require('./lib/elastic-client')

const NUM_DOCS_ESTIMATE = 2636605
const INDEX = process.env.ELASTIC_INDEX
const INDEX_SETTINGS = {}
const INDEX_MAPPINGS = {
  _doc: {
    properties: {
      pcd: {
        type: "keyword"
      },
      pcd2: {
        type: "keyword"
      },
      pcds: {
        type: "keyword"
      },
      dointr: {
        type: "keyword"
      },
      doterm: {
        type: "keyword"
      },
      usertype: {
        type: "keyword"
      },
      oseast1m: {
        type: "keyword"
      },
      osnrth1m: {
        type: "keyword"
      },
      osgrdind: {
        type: "keyword"
      },
      oa11: {
        type: "keyword"
      },
      cty: {
        type: "keyword"
      },
      ced: {
        type: "keyword"
      },
      laua: {
        type: "keyword"
      },
      ward: {
        type: "keyword"
      },
      hlthau: {
        type: "keyword"
      },
      nhser: {
        type: "keyword"
      },
      ctry: {
        type: "keyword"
      },
      rgn: {
        type: "keyword"
      },
      pcon: {
        type: "keyword"
      },
      eer: {
        type: "keyword"
      },
      teclec: {
        type: "keyword"
      },
      ttwa: {
        type: "keyword"
      },
      pct: {
        type: "keyword"
      },
      nuts: {
        type: "keyword"
      },
      park: {
        type: "keyword"
      },
      lsoa11: {
        type: "keyword"
      },
      msoa11: {
        type: "keyword"
      },
      wz11: {
        type: "keyword"
      },
      ccg: {
        type: "keyword"
      },
      bua11: {
        type: "keyword"
      },
      buasd11: {
        type: "keyword"
      },
      ru11ind: {
        type: "keyword"
      },
      oac11: {
        type: "keyword"
      },
      lat: {
        type: "keyword"
      },
      long: {
        type: "keyword"
      },
      lep1: {
        type: "keyword"
      },
      lep2: {
        type: "keyword"
      },
      pfa: {
        type: "keyword"
      },
      imd: {
        type: "keyword"
      },
      calncv: {
        type: "keyword"
      },
      stp: {
        type: "keyword"
      }
    }
  }
}

const bulkOps = docs => {
  return docs.reduce((agg, doc) => {
    const _id = doc.pcd
    if (!_id) throw new Error('Bulk op is missing _id property')
    return [
      ...agg,
      {
        index: {
          _id,
          _index: INDEX,
          _type: '_doc',
          retry_on_conflict: 2,
        }
      },
      doc,
    ]
  }, [])
}

const bulkPromise = ops => {
  if (ops.length === 0) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    esClient.bulk(
      { body: ops },
      (err, res) => {
        if (err) {
          return reject(err)
        }
        if (res.errors) {
          const errItems = res.items.filter(x => x.update && x.update.error).map(x => x.update.error) // assume ops were type 'update'
          return reject(errItems)
        }
        return resolve(res)
      }
    )
  })
}

async function esIndex() {
  try {
    await esClient.indices.create({
      index: INDEX,
      body: {
        settings: INDEX_SETTINGS,
        mappings: INDEX_MAPPINGS,
      }
    })
    log.info(`Successfully created index '${INDEX}'`)
  } catch(e) {
    log.error(`Failed to create index '${INDEX}'`)
    log.error(e)
    process.exit(1)
  }

  try {
    const progressBar = getProgressBar('Starting stream')
    progressBar.start(NUM_DOCS_ESTIMATE, 0)
    const objectStream = createCsvStream(process.env.NSPL_CSV)

    const totalCount = await streamBatchPromise(
      objectStream,
      x => x,
      (docs, counter) => {
        progressBar.update(counter)
        const ops = bulkOps(docs)
        return bulkPromise(ops)
      },
      { batchSize: 1000 },
    )
    progressBar.update(NUM_DOCS_ESTIMATE)
    progressBar.stop()
    log.info(`Successfully indexed ${totalCount} documents`)
  } catch(e) {
    log.error('Failed to index documents')
    log.error(e)
    process.exit(1)
  }

}

esIndex()
