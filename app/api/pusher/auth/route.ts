import { json } from "stream/consumers";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export const POST = async (request: Request, res: NextApiResponse) => {
  const body = await request.formData();

  // Tạo access token
  const user = {
    user_id: body.get("userId") as string,
    user_info: {
      name: body.get("username") as string,
    },
  };
  const authResponse = pusherServer.authorizeChannel(
    body.get("socket_id") as string,
    body.get("channel_name") as string,
    user
  );

  // Trả về access token
  return NextResponse.json(authResponse);
};
