import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      _id: "1",
      name: "Điện tử - điện máy",
      slug: "dien-tu-dien-may",
    },
    {
      _id: "2",
      name: "Điện gia dụng",
      slug: "dien-gia-dung",
    },
  ]);
}
