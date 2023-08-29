import prisma from "@/app/libs/prisma";
import { getCurrentUser } from "./../../../libs/getCurrentUser";
import { NextResponse } from "next/server";
import _ from "lodash";
import { pusherServer } from "@/app/libs/pusher";
export const POST = async (request: Request) => {
  const body = await request.json();
  const session = await getCurrentUser();
  if (!session?.user.id)
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  try {
    const conservation = await prisma.conservation.findUnique({
      where: {
        id: body.id,
      },
      include: {
        user: true,
      },
    });

    if (
      conservation &&
      _.findIndex(conservation.user, (us) => {
        return us.id == session.user.id;
      }) >= 0
    ) {
      console.log("hhasd");

      await prisma.conservation.update({
        where: {
          id: body.id,
        },
        data: {
          user: {
            disconnect: [
              {
                id: session.user.id,
              },
            ],
          },
        },
      });

      await pusherServer.trigger(session.user.id, "conservation:move_out", {
        newConservation: conservation,
        userOut: session.user.name || session.user.email,
      });
    }
    return new NextResponse("ok", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Invalid data", {
      status: 500,
    });
  }
};
