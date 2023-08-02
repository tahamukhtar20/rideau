"use client";
import { login } from "@/data/login/login";
import React from "react";
import { useForm } from "react-hook-form";
import { DefaultField } from "@/components/shared/DefaultField";
import { Label } from "@/components/shared/Label";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const formHandler = (data: any) => {
    console.log(data);
  };

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
