import jwt from "jsonwebtoken";
import { JWTOptions } from "next-auth/jwt";

const defaultOptions = {
  expireIn: "7d",
};
const secret = process.env.SECRET as string;
export const signToken = (data: any, option: any = defaultOptions) => {
  const token = jwt.sign(data, secret);
  return token;
};
export const verifyToken = (token: string, option: any = defaultOptions) => {
  const decode = jwt.sign(token, secret);
  return decode;
};
