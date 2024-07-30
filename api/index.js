import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import { storage } from "./firebase/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import mergedTypeDefs from "./graphql/typeDefs/index.js";
import mergeResolvers from "./graphql/resolvers/index.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_DB;
console.log("Conectando ao MongoDB....");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((error) => {
    console.log("Erro de conexão com MongoDB: ", error.message);
  });

const upload = multer({ storage: multer.memoryStorage() });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const schema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers: mergeResolvers,
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res }),
    })
  );

  // Configuração CORS
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );

  // Rota para upload de imagem
  app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("Nenhuma imagem foi enviada.");
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).send("O arquivo enviado não é uma imagem.");
      }

      const storageRef = ref(storage, `images/${req.file.originalname}`);
      await uploadBytes(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      const url = await getDownloadURL(storageRef);

      // Aqui você deve salvar a URL no MongoDB
      // Exemplo:
      // await YourModel.create({ imageUrl: url });

      res.status(200).json({ url });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao fazer upload da imagem.");
    }
  });

  const PORT = 8000;

  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/graphql`);
  });
};

start();

// import express from "express";
// import cors from "cors";
// import { ApolloServer } from "@apollo/server";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import { expressMiddleware } from "@apollo/server/express4";
// import { makeExecutableSchema } from "@graphql-tools/schema";

// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/lib/use/ws";

// import http from "http";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import mergedTypeDefs from "./graphql/typeDefs/index.js";
// import mergeResolvers from "./graphql/resolvers/index.js";

// dotenv.config();

// const MONGODB_URI = process.env.MONGO_DB;
// console.log("Conectando ao MongoDB....");

// mongoose
//   .connect(MONGODB_URI)
//   .then(() => {
//     console.log("Conectado ao MongoDB");
//   })
//   .catch((error) => {
//     console.log("Erro de conexão com MongoDB: ", error.message);
//   });

// const start = async () => {
//   const app = express();
//   const httpServer = http.createServer(app);

//   const wsServer = new WebSocketServer({
//     server: httpServer,
//     path: "/graphql",
//   });

//   const schema = makeExecutableSchema({
//     typeDefs: mergedTypeDefs,
//     resolvers: mergeResolvers,
//   });

//   const serverCleanup = useServer({ schema }, wsServer);

//   const server = new ApolloServer({
//     schema,
//     plugins: [
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       {
//         async serverWillStart() {
//           return {
//             async drainServer() {
//               await serverCleanup.dispose();
//             },
//           };
//         },
//       },
//     ],
//   });

//   await server.start();

//   app.use(
//     "/graphql",
//     cors(),
//     express.json(),
//     expressMiddleware(server, {
//       context: ({ req, res }) => ({ req, res }),
//     })
//   );

//   const PORT = 8000;

//   httpServer.listen(PORT, () => {
//     console.log(`Servidor rodando em http://localhost:${PORT}/graphql`);
//   });
// };

// start();
