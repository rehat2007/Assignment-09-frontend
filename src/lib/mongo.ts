import { setServers } from "node:dns";
import { MongoClient } from "mongodb";

// Some local Windows setups point Node's resolver at 127.0.0.1, which refuses
// the SRV lookup needed by mongodb+srv://. Allow a public resolver override.
if (process.env.MONGODB_DNS_SERVERS) {
  setServers(
    process.env.MONGODB_DNS_SERVERS.split(",")
      .map((server) => server.trim())
      .filter(Boolean),
  );
}

const mongoUri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const mongoDatabase = process.env.MONGODB_DB ?? "fixmate";

// Next.js can reload server modules during development; reuse one client.
const globalForMongo = globalThis as unknown as {
  fixmateMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.fixmateMongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.fixmateMongoClient = mongoClient;
}

export const mongoDb = mongoClient.db(mongoDatabase);
