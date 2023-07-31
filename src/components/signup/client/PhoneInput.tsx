import { signup } from "@/data/signup/signup";
import React from "react";

export async function trPhone({
  index,
  key,
}: {
  index: number;
  key: (typeof signup.options)[0];
}) {
  return (
    <tr key={index} className="border-0 flex w-full lg:flex-row flex-col ">
      <td className="label font-black ml-1 lg:self-center lg:w-1/3 ">
        <span className="label-text">
          {key.label} {key.required && <span className="text-red-500">*</span>}
        </span>
      </td>
      <td className="w-full">
        <input
          type="text"
          placeholder={key.placeholder}
          className="input input-bordered rounded input-md w-full"
          required={key.required}
        />
      </td>
    </tr>
  );
}
