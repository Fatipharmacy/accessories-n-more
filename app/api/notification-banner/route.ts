import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL!;
const dbName = "windowshopdb";
const collectionName = "Settings";
const docId = "notification-banner";

export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const doc = await db.collection(collectionName).findOne({ _id: docId });
    return NextResponse.json({ message: doc?.bannerMessage || "" });
  } catch (e) {
    return NextResponse.json({ message: "" });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const client = new MongoClient(uri);
  try {
    const { message } = await request.json();
    await client.connect();
    const db = client.db(dbName);
    await db.collection(collectionName).updateOne(
      { _id: docId },
      { $set: { bannerMessage: message } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false });
  } finally {
    await client.close();
  }
}
