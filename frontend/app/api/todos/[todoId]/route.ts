import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

type Params = {
  params: Promise<{
    todoId: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { todoId } = await params;
  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    cache: "no-store",
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { todoId } = await params;
  const body = await request.json();
  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { todoId } = await params;
  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  return new NextResponse(null, { status: response.status });
}
