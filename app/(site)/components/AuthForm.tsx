"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "@/app/components/buttons/Button";
import Input from "@/app/components/inputs/Input";
import clsx from "clsx";
import { type } from "os";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import axios from "axios";
import { useRouter } from "next/navigation";
type Props = {};
type Variant = "LOGIN" | "REGISTER";
const AuthForm = (props: Props) => {
  const { data: session } = useSession();
  console.log("session", session);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    if (session?.user) {
      router.push("/users");
    }
  }, [session?.user]);
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const toggleVariant = useCallback(() => {
    if (variant == "LOGIN") setVariant("REGISTER");
    else setVariant("LOGIN");
    reset();
  }, [variant]);
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    if (variant == "REGISTER") {
      axios
        .post("/api/register", {
          ...data,
        })
        .then((res) => {
          signIn("credentials", {
            ...data,
            redirect: false,
          }).then((callback) => {
            if (callback?.ok) {
              router.push("/users");
            }
            if (callback?.error) {
              console.log(callback.error);
            }
          });
        })
        .catch((res) => {
          console.log(res);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.ok) {
            router.push("/users");
          }
          if (callback?.error) {
            console.log(callback.error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loginSocial = async (name: string) => {
    setLoading(true);
    await signIn(name, { redirect: false })
      .then((callback) => {
        if (callback?.ok) router.push("/users");
        if (callback?.error) console.log(callback.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full px-2"
      >
        <Input
          type="email"
          id="email"
          label="email"
          register={register("email", {
            required: "This field must'nt be empty",
            pattern: {
              value:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
              message: "Please fill with your email",
            },
          })}
          error={errors["email"]}
          placeholder="Oz@newworld.oz"
          disabled={loading}
        />

        {variant == "REGISTER" && (
          <Input
            id="username"
            label="username"
            register={register("username", {
              required: "This field must'nt be empty",
            })}
            error={errors["username"]}
            placeholder="ozusername"
            disabled={loading}
          />
        )}

        <Input
          type="password"
          id="password"
          label="password"
          register={register("password", {
            required: "This field must'nt be empty",
            minLength: {
              value: 6,
              message: "Please fill at least 6 characters",
            },
          })}
          error={errors["password"]}
          placeholder="*************"
          disabled={loading}
        />

        <Button
          name={variant}
          state="primary"
          className="w-full my-4"
          disabled={loading}
        />
      </form>
      <div className="w-full flex items-center justify-center px-2">
        <div className="border border-slate-300 flex-1"></div>
        <div className="text-xs font-light italic tracking-wide mx-2">
          Or continue with
        </div>
        <div className="border border-slate-300 flex-1"></div>
      </div>
      <div className="px-2 flex md:justify-center flex-wrap  justify-start gap-2">
        <Button
          Icon={<FcGoogle className="text-3xl" />}
          name="Google"
          className="text-gray-800  hover:border-none border-none text-base"
          onClick={() => {
            loginSocial("google");
          }}
        ></Button>
        <Button
          Icon={<AiFillGithub className="text-3xl" />}
          name="Github"
          className=" text-gray-800  hover:border-none border-none text-base"
          onClick={() => {
            loginSocial("github");
          }}
        ></Button>
      </div>
      <div className="w-full flex items-center justify-center text-xs py-2 gap-2">
        <span>{variant == "LOGIN" ? "New to OZ ?" : "Already register ?"}</span>
        <span
          onClick={() => {
            if (!loading) toggleVariant();
          }}
          className={clsx(
            loading && "opacity-50 cursor-none",
            "underline cursor-pointer font-semibold "
          )}
        >
          {variant == "LOGIN" ? "Register now." : "Login now."}
        </span>
      </div>
    </div>
  );
};

export default AuthForm;
