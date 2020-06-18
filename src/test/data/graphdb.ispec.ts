import { stringify } from "querystring"
import { GraphDB } from "../../main/data/graphdb"
var path = require('path')

const url: string = process.env.GRAPHDB_URL ? process.env.GRAPHDB_URL : `http://localhost:9998`
const repo: string = process.env.GRAPHDB_REPO ? process.env.GRAPHDB_REPO : `soaas`
const adminPassword: string | undefined = process.env.GRAPHDB_ADMIN_PASSWORD ? process.env.GRAPHDB_ADMIN_PASSWORD : undefined
const options = adminPassword ? { url: url, repo: repo, adminPassword: adminPassword} : { url: url, repo: repo }

describe('Integration - GraphDB - Semantic Similarity, Index Query', () => {

  let url: string
  let repo: string
  let adminPassword: string
  let graphdb: GraphDB

  jest.setTimeout(10000);

  beforeAll(async (done) => {
    graphdb = new GraphDB(options)
    await graphdb.init()
    var dataPath = path.join(__dirname, '..', 'resources', 'data')
    await graphdb.loadDir(dataPath)
    done()
  })

  test('Similar to Luke Skywalker', async (done) => {
    const similarIds: any[] = await graphdb.getSimilarSubjects("https://swapi.co/resource/human/1", "Human")
    expect(similarIds.length).toBeGreaterThan(2)
    done()
  })

})
