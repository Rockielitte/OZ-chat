import { NextResponse } from "next/server";
import bcript from "bcrypt";
import prisma from "@/app/libs/prisma";
import { signToken } from "@/app/libs/jsonToken";
interface user {
  email: string;
  password: string;
}
export async function POST(req: Request) {
  const body: user = await req.json();
  const { email, password } = body;
  const userRes = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hashedPassword: true,
    },
  });

  if (
    userRes &&
    (await bcript.compare(password, userRes?.hashedPassword as string))
  ) {
    const accessToken = signToken({
      id: userRes.id,
      name: userRes?.name,
      email: userRes?.email,
      image: userRes?.image,
    });
    const user = {
      id: userRes.id,
      name: userRes?.name,
      email: userRes?.email,
      image: userRes?.image,
      accessToken,
    };
    return new Response(JSON.stringify(user));
  }
  return new Response(JSON.stringify({ error: "Not existed" }), {
    status: 501,
  });
}
