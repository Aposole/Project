// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const gameProtoPath = 'game.proto';
const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;

const resolvers = {
    Query: {
        game: (_, { id }) => {
            const client = new gameProto.GameService('localhost:50051',
            grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getGame({ gameId: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.game);
                    }
                });
            });
        },
        games: () => {
            const client = new gameProto.GameService('localhost:50051',
            grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchGames({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.Games);
                    }
                });
            });
        },
    },
};
module.exports = resolvers;