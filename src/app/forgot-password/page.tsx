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

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  async function formHandler(data: any) {
    const toastId = toast.loading(
      "Envoi de l'e-mail de réinitialisation du mot de passe...",
      {
        theme: "colored",
        position: "top-center",
      }
    );
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.update(toastId, {
        render:
          "E-mail de réinitialisation du mot de passe envoyé! Rediriger pour se connecter",
        type: "success",
        theme: "colored",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        toast.dismiss(toastId);
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast.update(toastId, {
          render: "Utilisateur non trouvé",
          type: "error",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "Erreur de mot de passe oublié :" + error,
          type: "error",
          theme: "colored",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
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
                <h1 className="font-secondary text-3xl lg:text-4xl mt-10 lg:mt-2">
                  {forgotPassword.title}
                </h1>
              </td>
            </tr>
            <tr className="border-0 w-full">
              <Label label={forgotPassword.emailLabel} required={false} />
              <DefaultField
                name={"email"}
                type={"email"}
                requiredLabel={forgotPassword.requiredLabel}
                required={true}
                placeholder={"E-mail"}
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
                  {forgotPassword.submitLabel}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </main>
  );
}
