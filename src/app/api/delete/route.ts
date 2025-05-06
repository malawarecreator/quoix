import clientPromise from "@/lib/db/mongo";
import { DeletionRequest } from "@/lib/DeletionRequest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const client = await clientPromise;
    const db = await client.db("quoix");
    const delreq = await db.collection("deletionrequests");
    const posts = await db.collection("posts");
    try {
        const body = await req.json();
        const request = new DeletionRequest(body);

        if (!request.isValid()) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!await posts.findOne({ id: request.requestedId })) {
            return NextResponse.json({ error: "No such post related to the provided Id" }, { status: 400 });
        }

        if (await delreq.findOne({requestedId: request.requestedId})) {
            return NextResponse.json({ error: "Request already created for the provided Id" }, { status: 400 });
        }

        let result = await delreq.insertOne(request.json());
        return NextResponse.json({ instertedId: result.insertedId }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}