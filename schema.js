const { gql } = require('@apollo/server');

const typeDefs = `#graphql
type Game {
id: String!
title: String!
description: String!
}
type Query {
game(id: String!): Game
games: [Game]
}
`
;
module.exports = typeDefs