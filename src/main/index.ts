const { ApolloServer } = require("apollo-server-express")
const { buildFederatedSchema } = require("@apollo/federation")
const express = require('express')
var bodyParser = require('body-parser');
import chalk from 'chalk'
import { typeDefs } from './gql/schema'
import { resolvers, similarity } from './gql/resolvers'

const path = '/graphql'
const app = express()
app.use(bodyParser({limit: '50mb'}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const port = 4009

const serviceDwell: number = process.env.GRAPHDB_HEALTH_DWELL ? +process.env.GRAPHDB_HEALTH_DWELL: 1000
const retries: number = process.env.GRAPHDB_HEALTH_RETRIES ? +process.env.GRAPHDB_HEALTH_RETRIES : 50

const plugins = {
  serverWillStart() {
    console.log('Server starting up!');
  }
}

// @TODO --> MongoGTG
app.get('/__gtg', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ gtg: "OK", message: "Mock SOaaS operating as expected" }));
})

// @TODO --> Mongo Health
app.get('/__health', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: "OK",
    id: `http://localhost:4007/graphql`,
    name: 'Organisation GraphQL HealthCheck',
    type: 'graphql',
    healthChecks: []
  }))
})

app.get('/__index', async function (req, res){
  await similarity.init(serviceDwell, retries)
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: "OK",
  }))
})

const main = async () => {
  try {
    await similarity.init(serviceDwell, retries)

    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers,
          plugins
        }
      ]),
      context: params => () => {
        console.log(params.req.body.query);
        console.log(params.req.body.variables);
        console.log(params.req.headers);
      }
    })
    server.applyMiddleware({app: app, path: path})

    let listener = app.listen({ port: port }, async () => {
      console.log(`🚀 Server ready at http://localhost:${port}${path}`)
    })
  } catch (e) {
    console.error(chalk.red(e.name + ', ' + e.message))
  }

}

main()
