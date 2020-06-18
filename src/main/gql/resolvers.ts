import { Similarity } from "../service/similarity";
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const url: string = process.env.GRAPHDB_URL ? process.env.GRAPHDB_URL : `http://localhost:9998`
const repo: string = process.env.GRAPHDB_REPO ? process.env.GRAPHDB_REPO : `soaas`
const adminPassword: string | undefined = process.env.GRAPHDB_ADMIN_PASSWORD ? process.env.GRAPHDB_ADMIN_PASSWORD : undefined
const options = adminPassword ? { url: url, repo: repo, adminPassword: adminPassword} : { url: url, repo: repo }

export const similarity: Similarity = new Similarity(options)

const VOC = 'https://swapi.co/vocabulary/'
const RESERVED_TYPES: string[] = [
  `${VOC}Character`, `${VOC}Mammal`, `${VOC}Sentient`,
  `${VOC}Amphibian`, `${VOC}Artificial`, `${VOC}Gastropod`,
  `${VOC}Insectoid`, `${VOC}Reptile`, `${VOC}Reptilian`,
  `${VOC}Unknown`]

export const resolvers = {

  Character: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    },
    __resolveType(character) {
      if (character.rdfType) {
        let result = character.rdfType
          .filter(type => !RESERVED_TYPES.includes(type))
          .map(type => type.replace( `${VOC}`,''))
          .toString()
        delete character.rdfType
        return result
      } else {
        throw "Missing Character type"
      }
    }
  },
  Aleena: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Besalisk: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Cerean: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Chagrian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Clawdite: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Droid: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Dug: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Ewok: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Geonosian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Gungan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Human: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    },
  },
  Hutt: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Iktotchi: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Kaleesh: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Kaminoan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Keldor: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Mirialan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Moncalamari: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Muun: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Nautolan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Neimodian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Pauan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Quermian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Rodian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Skakoan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Sullustan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Tholothian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Togruta: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Toong: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Toydarian: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Trandoshan: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Twilek: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Umbaran: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Vulptereen: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Wookiee: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Xexto: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Yodasspecies: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Zabrak: {
    similar(reference) {
      return similarity.getSimilar(reference.id, reference.__typename)
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      //return value.getTime(); // value sent to the client
      return value
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
}
