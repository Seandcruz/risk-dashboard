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

    // Create or use collection
    const collection = db.collection("risks");

    // Insert sample risk (only once)
    const sampleRisk = {
      title: "API Failure Risk",
      severity: "High",
      status: "Open",
      createdAt: new Date(),
    };

    await collection.insertOne(sampleRisk);

    const allRisks = await collection.find({}).toArray();

    res.status(200).json({
      success: true,
      message: "Risk data stored successfully 🚀",
      totalRisks: allRisks.length,
      data: allRisks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}