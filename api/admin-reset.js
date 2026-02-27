import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromiseReset) {
  client = new MongoClient(uri);
  global._mongoClientPromiseReset = client.connect();
}
clientPromise = global._mongoClientPromiseReset;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("risk-dashboard");
    const collection = db.collection("admin_config");

    // 🔥 Seed admin config with default passwords
    await collection.updateOne(
      {},
      {
        $set: {
          csms: [],
          passwords: {
            admin: "admin123",
            manager: "manager123",
          },
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin config reset successfully",
      login: {
        admin: "admin123",
        manager: "manager123",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}