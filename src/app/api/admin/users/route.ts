import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/users';

// Lấy danh sách người dùng
export async function GET() {
  try {
    const response = await axios.get(BASE_URL);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('GET /users failed:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Tạo người dùng mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axios.post(BASE_URL, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('POST /users failed:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
