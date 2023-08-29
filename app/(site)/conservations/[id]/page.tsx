import EmptyConservation from "@/app/components/EmptyConservation";
import { MessageBox } from "@/app/components/MessageBox";
import getConservationById from "@/app/libs/getConservationById";

const page = async ({ params }: { params: { id: string } }) => {
  const conservation = await getConservationById(params.id);

  return (
    <div className="flex flex-1 h-full min-h-0">
      {conservation ? (
        <MessageBox data={conservation} />
      ) : (
        <EmptyConservation />
      )}
    </div>
  );
};

export default page;
