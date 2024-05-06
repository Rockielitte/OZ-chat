import prisma from "@/app/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcript from "bcrypt";
import { NextResponse } from "next/server";
import { stringify } from "querystring";
interface userRegister {
  username: string;
  email: string;
  password: string;
}
export async function POST(req: Request, res: NextApiResponse) {
  //   if (req.method == "GET")
  //     return res.status(405).send({ message: "Only post method" });
  const body = await req.json();
  const { email, username: name, password } = body;
  const hashedPassword = await bcript.hash(password, 10);
  console.log(hashedPassword, "llll");

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  if (user) return NextResponse.json(user);
  else return NextResponse.error();
}
