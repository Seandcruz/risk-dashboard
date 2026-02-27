import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromiseAdmin) {
  client = new MongoClient(uri);
  global._mongoClientPromiseAdmin = client.connect();
}
clientPromise = global._mongoClientPromiseAdmin;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("risk-dashboard");
    const collection = db.collection("admin_config");

    // GET → Load admin config
    if (req.method === "GET") {
      const config = await collection.findOne({});
      return res.status(200).json({
        success: true,
        data: config || { csms: [], passwords: {} },
      });
    }

    // POST → Save admin config
    if (req.method === "POST") {
      const { csms, passwords } = req.body;

      await collection.updateOne(
        {},
        { $set: { csms, passwords } },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: "Admin config saved",
      });
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}