import { Message } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { CldUploadWidget } from "next-cloudinary";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsFillImageFill, BsFillSendFill } from "react-icons/bs";
import { IMessage } from "../type";
interface Iprops {
  conservationId: string;
}
interface IFieldValues {
  conservationId?: string;
  body: string;
  image: string;
}
const MessageInput: React.FC<Iprops> = ({ conservationId }) => {
  const [loading, setLoading] = useState(false);
  const { register, reset, setValue, handleSubmit } = useForm<IFieldValues>({
    defaultValues: {
      conservationId: conservationId,
      body: "",
      image: "",
    },
  });
  const submitInput: SubmitHandler<IFieldValues> = async (data) => {
    setLoading(true);
    await axios
      .post(`/api/conservations/${conservationId}/send`, data)
      .then((res) => {
        reset();
      });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(submitInput)}
      className={clsx("flex gap-4 p-2 px-6 border-t shadow-sm items-center ")}
      noValidate
    >
      <CldUploadWidget
        uploadPreset="messageImage"
        onUpload={async (data: any) => {
          setLoading(true);
          await axios
            .post(`/api/conservations/${conservationId}/send`, {
              image: data.info.secure_url,
            })
            .then((res) => {
              reset();
            });
          setLoading(false);
        }}
      >
        {({ open }) => {
          function handleOnClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <button className="button" onClick={handleOnClick}>
              <BsFillImageFill
                size={24}
                className={clsx(
                  "text-pink-500 cursor-pointer",
                  loading && "opacity-50 cursor-wait"
                )}
              />
            </button>
          );
        }}
      </CldUploadWidget>

      <input
        {...register("body", {
          required: "This field is not empty",
        })}
        className={clsx(
          "flex-1 outline-none border  focus:border-red-200 rounded-lg p-1 ",
          loading && "opacity-50 cursor-wait"
        )}
        readOnly={loading}
      />
      <button type="submit" disabled={loading}>
        <BsFillSendFill
          size={24}
          className={clsx(
            "text-pink-500 cursor-pointer",
            loading && "opacity-50 cursor-wait"
          )}
        />
      </button>
    </form>
  );
};

export default MessageInput;
