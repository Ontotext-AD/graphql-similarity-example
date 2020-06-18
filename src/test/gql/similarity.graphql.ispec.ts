const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require("apollo-server-express")
const { buildFederatedSchema } = require("@apollo/federation")
const { gql } = require("apollo-server-express")

import { typeDefs } from '../../main/gql/schema'
import { GraphDB } from "../../main/data/graphdb"
import { resolvers, similarity } from '../../main/gql/resolvers'

var path = require('path')

const serviceDwell: number = process.env.GRAPHDB_HEALTH_DWELL ? +process.env.GRAPHDB_HEALTH_DWELL: 1000
const retries: number = process.env.GRAPHDB_HEALTH_RETRIES ? +process.env.GRAPHDB_HEALTH_RETRIES : 50
const url: string = process.env.GRAPHDB_URL ? process.env.GRAPHDB_URL : `http://localhost:9998`
const repo: string = process.env.GRAPHDB_REPO ? process.env.GRAPHDB_REPO : `soaas`
const adminPassword: string | undefined = process.env.GRAPHDB_ADMIN_PASSWORD ? process.env.GRAPHDB_ADMIN_PASSWORD : undefined
const options = adminPassword ? { url: url, repo: repo, adminPassword: adminPassword} : { url: url, repo: repo }

describe('Integration - Similarity Query Tests', () => {

  let url: string
  let repo: string
  let graphdb: GraphDB

  jest.setTimeout(10000);

  beforeAll(async (done) => {
    graphdb = new GraphDB(options)
    await graphdb.init()
    var dataPath = path.join(__dirname, '..', 'resources', 'data')
    await graphdb.loadDir(dataPath)
    try {
      await similarity.init(1000, 5)
    }catch(Error) {
      console.log("GraphDB not RUNNING! Please start using docker-compose up graphdb")
      fail()
    }
    done()
  })

  test('Similar to Humans as Human', async (done) => {
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const GET_HUMAN = gql`
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ... on Human {
            similar {
              id
            }
          }
        }
      }
    `
    const HUMAN_VARS =
    {
      representations: [
        { __typename: "Human", id: "https://swapi.co/resource/human/1" },
        { __typename: "Human", id: "https://swapi.co/resource/human/29" }
      ]
    }

    try {
      const res = await query({ query: GET_HUMAN, variables: HUMAN_VARS});
      expect(res.data._entities.length).toEqual(2)
      expect(res.error).toBeUndefined()
      done()
    } catch (error) {
      console.log(error)
      fail()
    }
  })

  test('Similar to Characters as Character', async (done) => {

    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const GET_CHARACTERS = gql`
      query ($representations: [_Any!]!) {
          _entities(representations: $representations) {
            ... on Aleena {
              similar {
                id
                __typename
              }
            }
            ... on Besalisk {
              similar {
                id
                __typename
              }
            }
            ... on Cerean {
              similar {
                id
                __typename
              }
            }
            ... on Chagrian {
              similar {
                id
                __typename
              }
            }
            ... on Clawdite {
              similar {
                id
                __typename
              }
            }
            ... on Droid {
              similar {
                id
                __typename
              }
            }
            ... on Dug {
              similar {
                id
                __typename
              }
            }
            ... on Ewok {
              similar {
                id
                __typename
              }
            }
            ... on Geonosian {
              similar {
                id
                __typename
              }
            }
            ... on Gungan {
              similar {
                id
                __typename
              }
            }
            ... on Human {
              similar {
                id
                __typename
              }
            }
            ... on Hutt {
              similar {
                id
                __typename
              }
            }
            ... on Iktotchi {
              similar {
                id
                __typename
              }
            }
            ... on Kaleesh {
              similar {
                id
                __typename
              }
            }
            ... on Kaminoan {
              similar {
                id
                __typename
              }
            }
            ... on Keldor {
              similar {
                id
                __typename
              }
            }
            ... on Mirialan {
              similar {
                id
                __typename
              }
            }
            ... on Moncalamari {
              similar {
                id
                __typename
              }
            }
            ... on Muun {
              similar {
                id
                __typename
              }
            }
            ... on Nautolan {
              similar {
                id
                __typename
              }
            }
            ... on Neimodian {
              similar {
                id
                __typename
              }
            }
            ... on Pauan {
              similar {
                id
                __typename
              }
            }
            ... on Quermian {
              similar {
                id
                __typename
              }
            }
            ... on Rodian {
              similar {
                id
                __typename
              }
            }
            ... on Skakoan {
              similar {
                id
                __typename
              }
            }
            ... on Sullustan {
              similar {
                id
                __typename
              }
            }
            ... on Tholothian {
              similar {
                id
                __typename
              }
            }
            ... on Togruta {
              similar {
                id
                __typename
              }
            }
            ... on Toong {
              similar {
                id
                __typename
              }
            }
            ... on Toydarian {
              similar {
                id
                __typename
              }
            }
            ... on Trandoshan {
              similar {
                id
                __typename
              }
            }
            ... on Twilek {
              similar {
                id
                __typename
              }
            }
            ... on Umbaran {
              similar {
                id
                __typename
              }
            }
            ... on Vulptereen {
              similar {
                id
                __typename
              }
            }
            ... on Wookiee {
              similar {
                id
                __typename
              }
            }
            ... on Xexto {
              similar {
                id
                __typename
              }
            }
            ... on Yodasspecies {
              similar {
                id
                __typename
              }
            }
            ... on Zabrak {
              similar {
                id
                __typename
              }
            }
          }
        }`

    const CHARACTER_VARS =
    {
      representations: [
        { __typename: "Droid", id: "https://swapi.co/resource/droid/23" },
        { __typename: "Human", id: "https://swapi.co/resource/human/29" }
      ]
    }

    try {
      const res = await query({ query: GET_CHARACTERS, variables: CHARACTER_VARS});
      expect(res.data._entities.length).toEqual(2)
      expect(res.error).toBeUndefined()
      done()
    } catch (error) {
      console.log(error)
      fail()
    }

  })

})
