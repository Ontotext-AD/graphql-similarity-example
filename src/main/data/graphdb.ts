const { RDFRepositoryClient } = require('graphdb').repository
const { GetQueryPayload, QueryType, UpdateQueryPayload } = require('graphdb').query
const { RepositoryClientConfig } = require('graphdb').repository
const { RDFMimeType } = require('graphdb').http
const { ServerClient, ServerClientConfig } = require('graphdb').server
const compile = require('es6-template-strings/compile')
const resolveToString = require('es6-template-strings/resolve-to-string')
const path = require('path')
const FormData = require('form-data')
import { readFile, createReadStream, readdirSync, readFileSync, readdir } from 'fs'
import { resolve } from 'dns'
import { isUndefined } from 'util'
const  axios = require('axios')

export const sleep = (time: number) => new Promise((r) => setTimeout(r, time))

export class GraphDB {

  url: string
  repo: string
  rdfClient: any
  server: any
  adminPassword: string | undefined

  constructor(options: any){
    this.url = options.url
    this.repo = options.repo
    if (!isUndefined(options.adminPassword)) {
      this.adminPassword = options.adminPassword
    }
  }

  async login() {
    try {
      let result = await axios.post(`${this.url}/rest/login/admin`, null,
        { headers: { 'X-GraphDB-Password': this.adminPassword }})
      if (result.status == 200) {
        return {status: 200, token: result.headers.authorization}
      } else if (result.status == 401) {
        throw "Unable to authenticate with configured admin password"
      } else {
        return {status: result.status}
      }
    } catch (error) {
      console.log(`Error ${error}`)
      throw "Unable to authenticate with configured admin password"
    }
  }

  async init() {
    let repositoryClientConfig: typeof RepositoryClientConfig
    if (!isUndefined(this.adminPassword)) {
      const result = await this.login()
      if (result.status != 200) {
        throw `Unable to authenticate ${result.status}`
      }
      repositoryClientConfig = new RepositoryClientConfig(
        [`${this.url}/repositories/${this.repo}`], {
          'Accept': RDFMimeType.SPARQL_RESULTS_XML,
          'authorization': result.token
        },
        '', 10000, 10000)
    } else {
      repositoryClientConfig = new RepositoryClientConfig(
        [`${this.url}/repositories/${this.repo}`], {
          'Accept': RDFMimeType.SPARQL_RESULTS_XML
        },
        '', 10000, 10000)
    }

    this.rdfClient = new RDFRepositoryClient(repositoryClientConfig)
    const serverConfig = new ServerClientConfig()
      .setEndpoint(this.url)
      .setTimeout(0)
      .setHeaders({});
    this.server = new ServerClient(serverConfig)
  }


  buildSimilarityQuery(id: string, type: string) {
    const filePath = path.join(__dirname, '..', 'resources', 'similarity-query.rq' )
    const similarityQueryTemplate = readFileSync(filePath).toString()
    return resolveToString(compile(similarityQueryTemplate), { id: id, type: type})
  }

  readStream(stream) {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any) => {
        chunks.push(Buffer.from(chunk))
      });
      stream.on('error', reject);
      stream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8').trim());
      });
    });
  }

  async getSimilarSubjects(id: string, type: string) {
    const payload = new GetQueryPayload()
        .setQuery(this.buildSimilarityQuery(id, type))
        .setQueryType(QueryType.SELECT)
        .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
        .setLimit(100);
    let results = await this.rdfClient.query(payload).then((response: any) => {
      return this.readStream(response)
    }).then((stream: string) => {
        let jsonResult = JSON.parse(stream)
        let results: any[] = []
        for (let i = 0; i < jsonResult.results.bindings.length; ++i) {
          let types: string = jsonResult.results.bindings[i].types.value
          let typesArray: string[] = types.split("|")
          let result = {
            id: jsonResult.results.bindings[i].documentID.value,
            rdfType: typesArray
          }
          results.push(result)
        }
        return results
      })
      return results
  }

  semanticSimilarityIndex() {
    const filePath = path.join(__dirname, '..', 'resources', 'similarity-index.rq' )
    return readFileSync(filePath).toString()
  }

  createIndex() {
    const payload = new UpdateQueryPayload()
        .setQuery(this.semanticSimilarityIndex())
    return this.rdfClient.update(payload).then(() => {
      return "Semantic similarity index created"
    })
  }

  hasRepo() {
    return this.server.hasRepository(this.repo).then((result)=>{
      console.log(`Repository ${this.repo} exists ${result}`)
      return result
    })
  }

  async createRepoIfDoesNotExist() {
    let $this = this
    return await $this.hasRepo().then(async function (result) {
      if (result) {
        return true
      } else {
        const form = new FormData()
        const filePath = path.join(__dirname, '..', 'resources', 'repo.ttl' )
        const readRepoConfigStream = createReadStream(filePath)
        form.append('config', readRepoConfigStream);
        const headers = {'Content-Type': 'multipart/form-data',
                         'Accept': 'application/json' }
        let result = await axios.post(`${$this.url}/rest/repositories`, form,
          {
            headers: headers,
          }
        )
        return result.status == 200 ? true : false
      }
    })
  }

  async loadDir(dirPath: string) {
    let $this = this
    let files = await readdirSync(dirPath)
    let requests = files.map(function (file) {
      return new Promise((resolve) => {
        let turtleFile = path.join(dirPath, file)
        $this.rdfClient.putFile(turtleFile, RDFMimeType.TURTLE)
          .then(() => {
            resolve()
          })
          .catch((e) => {
            console.log(e)
            throw e
          })
      })
    })
    await Promise.all((requests)).then(() => {
      console.log("Loaded Everything")
    })

  }

  async healthCheck() {
    console.log(`Heath Check ${`${this.url}/repositories/${this.repo}/health`}`)
    let authResult: { status: number; token: any } | { status: any; token?: undefined }
    try {
      let result: { status: number; data: any }
      if (!isUndefined(this.adminPassword)) {
        let authResult = await this.login()
        result = await axios.get(`${this.url}/repositories/${this.repo}/health`,
          { headers: { 'Authorization': authResult.token }})
      } else {
        result = await axios.get(`${this.url}/repositories/${this.repo}/health`)
      }
      if (result.status == 200) {
        return result.data
      } else {
        return { "name": "soaas", "status": "red"}
      }
    } catch (error) {
      console.log(`Error ${error}`)
      return { "name": "soaas", "status": "red"}
    }
  }

  async health(serviceDwell: number | undefined, retries: number) {
    let tries = 0
    while (tries < retries) {
      const healthResult = await this.healthCheck()
      if (healthResult.status !== "green") {
          await sleep(serviceDwell === undefined ? 1000 : serviceDwell)
          console.log(`Waiting for GraphDB repo ${this.repo} to be green`)
          tries++
      } else {
          console.log(`GraphDB repo ${this.repo} green`)
          return healthResult
      }
      if (tries == retries) {
        console.log(`Giving up reached retry limit ${retries}`)
        return  { "name": "soaas", "status": "red"}
      }
    }
  }

}
