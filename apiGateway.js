// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const gameProtoPath = 'game.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');



const app = express();
const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;


const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
  console.log('API Gateway running');
});

app.get('/Games', (req, res) => {
    const client = new gameProto.GameService('localhost:3000',
    grpc.credentials.createInsecure());
    client.searchGames({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.Games);
        }
    });
});
app.get('/games/:id', (req, res) => {
    const client = new gameProto.GameService('localhost:3000',
    grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getGame({ gameId: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});
app.post('/games', (req, res) => {
    const client = new gameProto.GameService('localhost:3000', grpc.credentials.createInsecure());
    const { title, description } = req.body;
    const newGame = { title, description };
    client.createGame({ game: newGame }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});
app.delete('/games/:id', (req, res) => {
    const client = new gameProto.GameService('localhost:3000', grpc.credentials.createInsecure());
    const id = req.params.id;
    client.deleteGame({ gameId: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
        }
    });
});
app.put('/games/:id', (req, res) => {
    const client = new gameProto.GameService('localhost:3000', grpc.credentials.createInsecure());
    const id = req.params.id;
    const { title, description } = req.body; // Assuming the request body contains name and genre parameters
    const updatedGame = { id, title, description };
  
    client.updateGame({ game: updatedGame }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.game);
      }
    });
  });

module.exports = app;
