import { Redis } from 'ioredis';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const REDIS_URL = process.env.REDIS_URL;
if(!REDIS_URL) {
    throw new Error("URLが未定義です");
}
const redis = new Redis(REDIS_URL);

const  SESSIONID_EXPIRTY = 60 * 60 * 24

export async function POST(request: Request) {
    const { userData } = await request.json();
    const sessionId = uuidv4();
    await redis.set(sessionId, JSON.stringify(userData), "EX", SESSIONID_EXPIRTY);
    return NextResponse.json({sessionId: sessionId}); 
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if(!sessionId) {
        return NextResponse.json({ error: "セッションIDが見つかりませんでした" }, { status: 400} )
    }

    const userData = await redis.get(sessionId);
    if(!userData) {
        return NextResponse.json({ error: "セッションIDが見つかりませんでした" }, { status: 400} )
    }
    console.log(userData);
    return NextResponse.json(JSON.parse(userData)); 
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if(!sessionId) {
        return NextResponse.json({ error: "セッションIDが見つかりませんでした" }, { status: 400} )
    }
    await redis.del(sessionId);
    return NextResponse.json({ message: "セッションIDを削除しました"});
}