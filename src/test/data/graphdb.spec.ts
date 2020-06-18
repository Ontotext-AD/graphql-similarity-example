const { RDFRepositoryClient } = require('graphdb').repository
const { GetQueryPayload, QueryType, QueryLanguage, UpdateQueryPayload } = require('graphdb').query
const { RepositoryClientConfig } = require('graphdb').repository
const { RDFMimeType } = require('graphdb').http
const { HttpClient } = require('graphdb').http
const { HttpRequestBuilder } = require('graphdb').http;
const { ObjectReadableMock } = require('stream-mock');
const { Readable } = require("stream")
const { ServerClient, ServerClientConfig } = require('graphdb').server
const path = require('path')
import { GraphDB } from '../../main/data/graphdb'
import { readFileSync } from 'fs'
import { timeStamp } from 'console'
const axios = require('axios')

jest.mock('graphdb/lib/http/http-client')
jest.mock('axios')

describe('GraphDB - Semantic Similarity, Index Query', () => {

  let url: string
  let repo: string
  let httpRequest
  let graphdb: GraphDB

  jest.setTimeout(10000);

  function httpStub(baseUrl) {
    return {
      baseUrl,
      setDefaultHeaders: jest.fn().mockReturnThis(),
      setDefaultReadTimeout: jest.fn().mockReturnThis(),
      setDefaultWriteTimeout: jest.fn().mockReturnThis(),
      request: jest.fn().mockResolvedValue({}),
      getBaseURL: () => baseUrl
    };
  }

  beforeEach(async (done) => {
    url = 'http://host:7200'
    repo = `soaas`
    HttpClient.mockImplementation(() => httpStub(url));
    const restApiConfig = new RepositoryClientConfig(
      [`${url}/repositories/${repo}`], {
        'Accept': RDFMimeType.SPARQL_RESULTS_XML
      },
      '', 10000, 10000);
    let rdfClient = new RDFRepositoryClient(restApiConfig);
    graphdb = new GraphDB({ url: url, repo: repo })
    axios.post.mockResolvedValue({
      headers: { authorization: `` },
      status: 200
    })
    graphdb.init()
    graphdb.rdfClient = rdfClient;
    httpRequest = graphdb.rdfClient.httpClients[0].request;
    done()
  })

  test('Create Similarity Index', async (done) => {
    const query = graphdb.semanticSimilarityIndex()
    const expectedRequestConfig = HttpRequestBuilder.httpPost('/statements')
      .setData(query)
      .setHeaders({
        'Content-Type': 'application/sparql-update'
      });
    let result = await graphdb.createIndex().then((value) => {
      console.log(value)
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(httpRequest).toHaveBeenCalledWith(expectedRequestConfig);
    })
    done()
  })

  test('Get Similar Humans', async (done) => {
    const id = "http://test/ing/123"
    const type = "Human"
    const similarHumansQuery = graphdb.buildSimilarityQuery(id, type)
    const filePath = path.join(__dirname, '..', 'resources', 'similarity-response.txt' )
    const responseData = readFileSync(filePath).toString()
    const readable = Readable.from([responseData])
    httpRequest.mockResolvedValue({
       data: readable
    });
    let results: any[] = await graphdb.getSimilarSubjects(id, type)
    expect(results.length).toEqual(5)
    done()
  })

  test('Repo exists', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);
    const filePath = path.join(__dirname, '..', 'resources', 'repo-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    });
    graphdb.server = testServer

    let result = await graphdb.hasRepo()
    expect(result).toEqual(true)
    done()
  })

  test('Create repo if does not exist', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);
    const filePath = path.join(__dirname, '..', 'resources', 'repo-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    });
    graphdb.server = testServer

    graphdb.repo = 'bad-does-not-exist'
    let result = await graphdb.hasRepo()
    expect(result).toEqual(false)

    axios.post.mockResolvedValue({
      data: {},
      status: 200
    })

    result = await graphdb.createRepoIfDoesNotExist()
    expect(result).toEqual(true)

    console.log(`Repository ${repo} created`)
    done()
  })


  test('Create repo does not exist and fails', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);
    const filePath = path.join(__dirname, '..', 'resources', 'repo-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    });
    graphdb.server = testServer

    graphdb.repo = 'bad-does-not-exist'
    let result = await graphdb.hasRepo()
    expect(result).toEqual(false)

    axios.post.mockResolvedValue({
      data: {},
      status: 500
    })

    result = await graphdb.createRepoIfDoesNotExist()
    expect(result).toEqual(false)

    console.log(`Repository ${repo} create failed`)
    done()
  })


  test('Create repo already exists', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);
    const filePath = path.join(__dirname, '..', 'resources', 'repo-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    });
    graphdb.server = testServer

    let result = await graphdb.hasRepo()
    expect(result).toEqual(true)

    result = await graphdb.createRepoIfDoesNotExist()
    expect(result).toEqual(true)

    console.log(`Repository ${repo} create ok (already exists)`)
    done()
  })

  test('Healthy', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);

    const filePath = path.join(__dirname, '..', 'resources', 'graphdb-health-check-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    })
    graphdb.server = testServer


    axios.get.mockResolvedValue({
      data: responseData,
      status: 200
    })

    let result = await graphdb.health(100,1)
    expect(result.status).toEqual("green")
    done()
  })

  test('Un Healthy', async(done) => {
    const testServerConfig = new ServerClientConfig()
      .setEndpoint('server/url')
      .setTimeout(0)
      .setHeaders({});
    const testServer = new ServerClient(testServerConfig);

    const filePath = path.join(__dirname, '..', 'resources', 'graphdb-health-check-response.json' )
    const responseData = JSON.parse(readFileSync(filePath).toString())

    testServer.httpClient.request = jest.fn().mockImplementation((request) => {
      if (request.getMethod() === 'get') {
        return Promise.resolve({data: responseData.repositories.GET})
      } else if (request.getMethod() === 'delete') {
        return Promise.reject()
      }
      return Promise.reject()
    })
    graphdb.server = testServer

    axios.get.mockResolvedValue({
      data: {},
      status: 500
    })

    let result = await graphdb.health(100, 5)
    expect(result.status).toEqual("red")

    axios.get.mockResolvedValue({
      data: { status: "red"},
      status: 200
    })
    result = await graphdb.health(100, 5)
    expect(result.status).toEqual("red")

    done()
  })

})
