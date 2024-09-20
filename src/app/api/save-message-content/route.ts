import { NextRequest, NextResponse } from 'next/server';

let messageContent = ""; // Temporary storage for message content

export async function POST(req:NextRequest) {
  try {
    const { content } = await req.json();

    messageContent = content
  
    return NextResponse.json({
      success: true,
      message:"Edit content get successfully",
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: true,
      message:"Edit content fetch failed",
      status: 400
    })
  }
}


export async function GET(request: NextRequest) {
  try {
    // Your logic to handle the GET request
    return NextResponse.json({ content: messageContent });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching message content' });
  }
}