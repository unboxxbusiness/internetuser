import { NextResponse } from 'next/server';

export async function POST() {
  const options = {
    name: 'session',
    value: '',
    maxAge: -1,
  };

  const response = new NextResponse(JSON.stringify({ status: 'success' }), { status: 200 });
  response.cookies.set(options);

  return response;
}
