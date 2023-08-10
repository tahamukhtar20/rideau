"use client";
import { login } from "@/data/login/login";
import LoginForm from "@/components/login/client/LoginForm";
import React from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "@/data/forgot-password/forgot-password";
import { Label } from "@/components/shared/Label";
import { DefaultField } from "@/components/shared/DefaultField";
import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { changePassword } from "@/data/change-password/change-password";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  async function formHandler(data: any) {}
  return (
    <main className="min-h-[calc(100vh-15.5rem)] flex flex-col items-center py-10">
      <form
        className="w-full flex justify-center"
        onSubmit={handleSubmit(formHandler)}
      >
        <table className="rounded-none table max-w-xl static">
          <tbody>
            <tr>
              <td className="col-span-2 flex justify-center">
                <h1 className="font-secondary text-3xl lg:text-4xl my-10 lg:my-2">
                  {changePassword.title}
                </h1>
              </td>
            </tr>
            <tr className="border-0 w-full">
              <Label
                label={changePassword.currentPasswordLabel}
                required={false}
              />
              <DefaultField
                name={"currPassword"}
                type={"password"}
                requiredLabel={changePassword.requiredLabel}
                required={true}
                placeholder={"Current Password"}
                register={register}
                errors={errors}
                regex={/.*/}
              />
            </tr>
            <tr className="border-0 w-full">
              <Label label={changePassword.newPasswordLabel} required={false} />
              <DefaultField
                name={"newPassword"}
                type={"password"}
                requiredLabel={changePassword.requiredLabel}
                required={true}
                placeholder={"New Password"}
                register={register}
                errors={errors}
                regex={/.*/}
              />
            </tr>
            <tr className="border-0 w-full">
              <Label
                label={changePassword.confirmPasswordLabel}
                required={false}
              />
              <DefaultField
                name={"confirmPassword"}
                type={"password"}
                requiredLabel={changePassword.requiredLabel}
                required={true}
                placeholder={"Confirm New Password"}
                register={register}
                errors={errors}
                regex={/.*/}
              />
            </tr>
            <tr>
              <td className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
                >
                  {changePassword.submitLabel}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </main>
  );
}
