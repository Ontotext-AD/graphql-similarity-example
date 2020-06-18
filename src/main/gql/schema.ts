const { gql } = require("apollo-server-express")

export const typeDefs = gql`

  extend interface Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Aleena implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Besalisk implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Cerean implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Chagrian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Clawdite implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Droid implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Dug implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Ewok implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Geonosian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Gungan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Human implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Hutt implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Iktotchi implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Kaleesh implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Kaminoan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Keldor implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Mirialan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Moncalamari implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Muun implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Nautolan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Neimodian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Pauan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Quermian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Rodian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Skakoan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Sullustan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Tholothian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Togruta implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Toong implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Toydarian implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Trandoshan implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Twilek implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Umbaran implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Vulptereen implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Wookiee implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Xexto implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
  }

  extend type Yodasspecies implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
 }

  extend type Zabrak implements Character @key(fields: "id") {
    id: ID! @external
    similar: [Character]
 }
`
