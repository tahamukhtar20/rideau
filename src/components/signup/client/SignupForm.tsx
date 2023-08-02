"use client";
import { signup } from "@/data/signup/signup";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { UtilsApi } from "@/routes/api/utils.api";
import { ICountryCode } from "@/app/api/interfaces/country-codes";
import { DefaultField, IField } from "@/components/shared/DefaultField";
import { Label } from "@/components/shared/Label";

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
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
