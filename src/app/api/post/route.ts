
import { clientPromise } from "@/lib/db/mongo";
import { Post } from "@/lib/Post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db("quoix");
  const posts = db.collection("posts");

  try {
    const body = await req.json();  
    const post = new Post(body);

    if (!post.isValid()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (await posts.findOne({ id: post.id})) {
      return NextResponse.json({ error: "ID in use"}, { status: 400 });
    }

    const result = await posts.insertOne(post.json());
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}


