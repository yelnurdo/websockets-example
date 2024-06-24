import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { message } = await request.json();
  const response = await axios.post('http://localhost:5000/api/chat', { message });
  return NextResponse.json(response.data);
}
