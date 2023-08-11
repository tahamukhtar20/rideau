"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/shared/Label";
import { DefaultField } from "@/components/shared/DefaultField";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "@firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { changePassword } from "@/data/change-password/change-password";
import { toast } from "react-toastify";
import authProtection from "@/components/HOC/authProtection";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  async function formHandler(data: any) {
    const toastId = toast.loading("Modification du mot de passe...", {
      theme: "colored",
      position: "top-center",
    });
    try {
      const user = auth.currentUser;
      if (user) {
        // Reauthenticate the user before changing the password (optional but recommended)
        const { currPassword, newPassword, confirmPassword } = data;
        if (newPassword !== confirmPassword) {
          toast.update(toastId, {
            render: "Les mots de passe ne correspondent pas",
            type: "error",
            theme: "colored",
            isLoading: false,
            autoClose: 2000,
          });
          return;
        }
        if (typeof user.email === "string") {
          const credential = EmailAuthProvider.credential(
            user.email,
            currPassword
          );
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
        }
        toast.update(toastId, {
          render: "Mot de passe changé!",
          type: "success",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "Utilisateur non trouvé",
          type: "error",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        toast.update(toastId, {
          render: "Mot de passe incorrect",
          type: "error",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "Erreur de modification du mot de passe :" + error,
          type: "error",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
  return (
    <>
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
    </>
  );
}

export default authProtection(ForgotPassword);
