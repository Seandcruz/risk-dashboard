import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("risk-dashboard");
    const collection = db.collection("risks");

    // GET → Fetch all risks
    if (req.method === "GET") {
      const risks = await collection.find({}).toArray();
      return res.status(200).json({
        success: true,
        count: risks.length,
        data: risks,
      });
    }

    // POST → Add new risk
    if (req.method === "POST") {
        const newEntry = {
            csm: req.body.csm,
            account: req.body.account,
            quarter: req.body.quarter,
            ratings: req.body.ratings,
            status: req.body.status,
            timestamp: req.body.timestamp || new Date().toISOString(),
          };

      const result = await collection.insertOne(newEntry);

      return res.status(201).json({
        success: true,
        message: "Risk profile saved to DB 🚀",
        id: result.insertedId,
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