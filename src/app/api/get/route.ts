import clientPromise from "@/lib/db/mongo";
import { Post } from "@/lib/Post";
import { NextApiRequest} from "next";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const client = await clientPromise;
    const db = client.db("quoix");
    const posts = db.collection("posts");

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id || Array.isArray(id)) {
        const allPosts = await posts.find({}).toArray();
        return NextResponse.json({ posts: allPosts }, { status: 200 });
    }
    let post = await posts.findOne({id: id});
    if (!post) {
        return NextResponse.json({error: `Unable to find Post with ID ${id}`}, { status: 404});
    }

    return NextResponse.json({post}, { status: 200});
    
}