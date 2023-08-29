import client from "@/app/libs/prisma";
export default async (id: string) => {
  try {
    const conservation = await client.conservation.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });
    return conservation;
  } catch (error) {
    console.log("Error at getConservationById");
    return null;
  }
};
