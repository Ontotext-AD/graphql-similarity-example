import { GraphDB } from "../data/graphdb"

export interface Character {
  id: number
}

export class Similarity {

  url: string
  repo: string
  adminPassword: string
  graphDB: GraphDB

  constructor(options: any) {
    this.url = options.url
    this.repo = options.repo
    this.adminPassword = options.adminPassword || undefined
    this.graphDB = new GraphDB(options)
  }

  async init(serviceDwell: number, retries: number) {
    await this.graphDB.init()
    let health = await this.graphDB.health(serviceDwell, retries)
    if (health.status === "red")
      throw "GraphDB unhealthy unable to start"
    // Healthy so login and get auth token
    await this.graphDB.init()
    // Now create the semantic index
    await this.graphDB.createIndex()
  }

  async getSimilar(id: string, type: string): Promise<any[]> {
    let results: any[] = await this.graphDB.getSimilarSubjects(id, type)
    return results
  }

}
