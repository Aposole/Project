const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://fortesting:app1234@yooo.qp2pr6e.mongodb.net/?retryWrites=true&w=majority';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const gameProtoPath = 'game.proto';
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,  
    enums: String,
    defaults: true,
    oneofs: true,
});
const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;
const gameService = {
    getGame: (call, callback) => {
        const game = {
            id: call.request.game_id,
            title: 'Exemple de film',
            description: 'Ceci est un exemple de film.',
        };
        callback(null, { game });
    },
    searchGames: (call, callback) => {
        const { query } = call.request;
        // Effectuer une recherche de films en fonction de la requête
        const games = [
            {
                id: '1',
                title: 'Exemple de film 1',
                description: 'Ceci est le premier exemple de film.',
            },
            {
                id: '2',
                title: 'Exemple de film 2',
                description: 'Ceci est le deuxième exemple de film.',
            },
            // Ajouter d'autres résultats de recherche de films au besoin
        ];
        callback(null, { games });
    },
    // Ajouter d'autres méthodes au besoin
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(gameProto.GameService.service, gameService);
const port = 3000;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
        if (err) {
          console.log('Error connecting to MongoDB:', err);
          return;
        }
      
        console.log('Connected to MongoDB successfully');
      
        //const db = client.db(dbName);
      
        // Use the 'db' object to perform database operations
      
        client.close(); // Close the connection when you're done
      });
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});
console.log(`Microservice de games en cours d'exécution sur le port ${port}`);
