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
      const newRisk = {
        title: req.body.title,
        severity: req.body.severity,
        status: req.body.status,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newRisk);

      return res.status(201).json({
        success: true,
        message: "Risk added successfully",
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