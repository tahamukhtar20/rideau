import React from "react";

export interface IField {
  type: string;
  name: string;
  requiredLabel: string;
  required: boolean;
  placeholder: string;
  register: any;
  errors: any;
  regex?: RegExp;
  watch?: any;
}
export const DefaultField = ({
  type,
  name,
  requiredLabel,
  required,
  placeholder,
  register,
  errors,
  regex = /.*/,
}: IField) => (
  <td className="w-full flex flex-col">
    {errors[name] && (
      <div
        className="tooltip tooltip-open tooltip-error"
        data-tip={requiredLabel}
      />
    )}
    <input
      {...register(name, {
        required: required,
        pattern: {
          value: regex,
        },
      })}
      type={type}
      placeholder={placeholder}
      className="input input-bordered rounded input-md w-full"
    />
  </td>
);
