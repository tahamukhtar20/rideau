"use client";
import { login } from "@/data/login/login";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DefaultField } from "@/components/shared/DefaultField";
import { Label } from "@/components/shared/Label";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  async function formHandler(data: any) {
    const toastId = toast.loading("Logging In...", {
      theme: "colored",
      position: "top-center",
    });
    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.update(toastId, {
        render: "Logged In! Redirecting to Home",
        type: "success",
        theme: "colored",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        toast.dismiss(toastId);
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      toast.update(toastId, {
        render: `Login Error: ${error}`,
        theme: "colored",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
      reset();
    }
  }

  return (
    <form
      className="w-full flex justify-center"
      onSubmit={handleSubmit(formHandler)}
    >
      <table className="rounded-none table max-w-xl static">
        <tbody>
          {login.options.map((key, index) => (
            <tr key={index} className="border-0 w-full">
              <Label label={key.label} required={false} />
              <DefaultField
                name={key.name}
                type={key.type}
                requiredLabel={key.requiredLabel}
                required={key.required}
                placeholder={key.placeholder}
                register={register}
                errors={errors}
                regex={key?.regex}
              />
            </tr>
          ))}
          <tr>
            <td className="col-span-2">
              <Link href={"/forgot-password"}>
                <h4 className="link link-primary link-hover">
                  {login.forgotPassword}
                </h4>
              </Link>
            </td>
          </tr>
          <tr>
            <td className="col-span-2">
              <Link href={"/signup"}>
                <h4 className="link link-primary link-hover">
                  {login.dontHaveAccount}
                </h4>
              </Link>
            </td>
          </tr>
          <tr>
            <td className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
              >
                {login.submit.label}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
