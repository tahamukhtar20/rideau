"use client";
import { signup } from "@/data/signup/signup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { UtilsApi } from "@/routes/api/utils.api";
import { ICountryCode } from "@/app/api/interfaces/country-codes";
import { DefaultField, IField } from "@/components/shared/DefaultField";
import { Label } from "@/components/shared/Label";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth, database } from "@/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, doc, setDoc } from "@firebase/firestore";

const PhoneField = ({
  type,
  name,
  requiredLabel,
  required,
  placeholder,
  register,
  errors,
}: IField) => {
  const optionsQuery = useQuery({
    queryKey: ["countryCodes"],
    queryFn: () => UtilsApi.getCountryCodes(),
  });

  return (
    <td className="w-full flex flex-col">
      {errors[name] && (
        <div
          className="tooltip tooltip-open tooltip-error"
          data-tip={requiredLabel}
        />
      )}
      <div className="flex-row flex join">
        <select
          id="countryCode"
          className={
            "select select-bordered join-item" +
            (errors[name] || errors["countryCode"] ? " select-error" : "")
          }
          {...register("countryCode", { required: required })}
          disabled={optionsQuery.isLoading || optionsQuery.isError}
        >
          <option
            value=""
            className={optionsQuery.isLoading ? "loading" : "hidden"}
          >
            {optionsQuery.isLoading
              ? "Loading..."
              : optionsQuery.isError
              ? "Error!"
              : "Select"}
          </option>
          {optionsQuery.isSuccess &&
            optionsQuery.data.data.map((key: ICountryCode, index: number) => (
              <option key={index} value={key.dial_code}>
                {key.dial_code}({key.code})
              </option>
            ))}
        </select>
        <input
          {...register(name, { required: required })}
          type={type}
          placeholder={placeholder}
          className="input input-bordered rounded input-md w-full join-item"
        />
      </div>
    </td>
  );
};

const ConfirmPasswordField = ({
  type,
  name,
  requiredLabel,
  required,
  placeholder,
  register,
  errors,
  watch,
}: IField) => (
  <td className="w-full flex flex-col">
    {errors[name]?.type === "required" && (
      <div
        className="tooltip tooltip-open tooltip-error"
        data-tip={requiredLabel}
      />
    )}
    {errors[name]?.type === "validate" && (
      <div
        className="tooltip tooltip-open tooltip-error"
        data-tip={errors[name].message}
      />
    )}
    <input
      {...register(name, {
        required: required,
        validate: (value: string) =>
          value === watch("password") || signup.passwordDontMatch,
      })}
      type={type}
      placeholder={placeholder}
      className="input input-bordered rounded input-md w-full"
    />
  </td>
);
export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [submitting, setSubmitting] = useState(false);

  async function formHandler(data: any) {
    const toastId = toast.loading("S'enregistrer...", {
      theme: "colored",
      position: "top-center",
    });
    try {
      setSubmitting(true);

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredentials.user.uid;

      if (user) {
        const userCollection = collection(database, "users");
        const userDocRef = doc(userCollection, user);
        await setDoc(userDocRef, {
          userId: user,
          countryCode: data.countryCode,
          phone: data.phone,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          website: data.website,
          company: data.company,
        }).then(() => {
          toast.update(toastId, {
            render:
              "\n" +
              "Inscription réussie! Redirection vers la page d'accueil...",
            type: "success",
            theme: "colored",
            isLoading: false,
            autoClose: 2000,
          });
        });
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.update(toastId, {
          render: "Cette adresse e-mail est déjà utilisée!",
          theme: "colored",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (error.code === "auth/invalid-email") {
        toast.update(toastId, {
          render: "Adresse e-mail invalide!",
          theme: "colored",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (error.code === "auth/weak-password") {
        toast.update(toastId, {
          render: "Mot de passe faible!",
          theme: "colored",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (error.code === "auth/operation-not-allowed") {
        toast.update(toastId, {
          render: "Opération non autorisée!",
          theme: "colored",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        console.error("Signup error:", error);
        toast.update(toastId, {
          render: `Erreur d'inscription: ${error}`,
          theme: "colored",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
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
      <table className="rounded-none table max-w-4xl mt-2 lg:mt-10 static">
        <tbody>
          {signup.options.map((key, index) => (
            <tr
              key={index}
              className="border-0 flex w-full lg:flex-row flex-col "
            >
              <Label label={key.label} required={key.required} />
              {key.name === "phone" ? (
                <PhoneField
                  name={key.name}
                  type={key.type}
                  requiredLabel={key.requiredLabel}
                  required={key.required}
                  placeholder={key.placeholder}
                  register={register}
                  errors={errors}
                />
              ) : key.name === "confirmPassword" ? (
                <ConfirmPasswordField
                  name={key.name}
                  type={key.type}
                  requiredLabel={key.requiredLabel}
                  required={key.required}
                  placeholder={key.placeholder}
                  register={register}
                  errors={errors}
                  watch={watch}
                />
              ) : (
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
              )}
            </tr>
          ))}
          <tr>
            <td className="col-span-2 flex justify-end">
              <Link href={"/login"}>
                <h5 className="link link-hover link-primary">
                  {signup.alreadyHaveAccount}
                </h5>
              </Link>
            </td>
          </tr>
          <tr>
            <td className="col-span-2 flex justify-end">
              {submitting ? (
                <button
                  type="submit"
                  className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
                  disabled
                >
                  Submitting...<span className="loading loading-spinner"></span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
                >
                  Submit
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
