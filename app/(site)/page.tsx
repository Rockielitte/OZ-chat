import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="w-full h-full relative">
        <video
          src={"/login/bgLoginloop.mp4"}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 flex flex-col p-5 md:p-20 justify-center items-center ">
          <div className="gap-2 w-4/5 md:w-3/5 lg:w-4/12 flex flex-col items-center bg-white/60 rounded-md pb-2 px-6   shadow-2xl">
            <Image
              src="/login/logo.svg"
              alt="OZlogo"
              width={200}
              height={200}
              style={{ objectFit: "fill" }}
            />
            <h1 className="text-4xl -mt-6  text-primary font-bold tracking-widest">
              OZ
            </h1>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
