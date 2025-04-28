"use server";

import DropboxResetPasswordEmail from "@/components/email-template";
import { getBaseUrl } from "@/lib/get-baseUrl";
import { Resend } from "resend";
import { users } from "../schema";
import { ResetPasswordEmail } from "@/components/password-email-template";
import TwoFactorEmailTemplate from "@/components/twoFacto-email-template";
// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_YAXKWvqM_4fGU7ktTjeNjeTK9hXZZwHtX");

export const sendEmail = async (
  email: string,
  token: string,
  userFirstName: string
) => {
  const confirmEmailLink = `${getBaseUrl()}/confirm-email?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    // to: ["delivered@resend.dev"],
    to: email,
    subject: "Confirm your email",
    react: DropboxResetPasswordEmail({ userFirstName, confirmEmailLink }),
  });

  if (error) {
    console.log(error);
  }

  //   res.status(200).json(data);
};

export const sendPasswordResetEmail = async (
  email: string,
  // username:string,
  token: string
) => {
  const resetLink = `${getBaseUrl()}/change-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    // to: ["delivered@resend.dev"],
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({ resetPasswordLink: resetLink }),
  });

  if (error) {
    console.log(error);
  }

  //   res.status(200).json(data);
};

export const sendTwoFactorEmail = async (email: string, code: string) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Two Factor Authentication Code SnapShop",
    react: TwoFactorEmailTemplate({ twoFactorCode: code }),
  });

  if (error) {
    console.log(error);
  }
};
