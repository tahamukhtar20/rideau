import { signup } from "@/data/signup/signup";
import { trPhone } from "@/components/signup/client/PhoneInput";
import React from "react";

export default function Signup() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center lg:justify-center">
      <h1 className="font-secondary text-4xl mt-10 lg:mt-2">{signup.title}</h1>
      <table className="rounded-none table max-w-4xl mt-2 lg:mt-10 static">
        <tbody className="">
          {signup.options.map((key, index) => {
            if (key.name === "phone") {
              return trPhone({ index, key });
            }
            return trElse({ index, key });
          })}
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
    </main>
  );
}

const trElse = ({
  index,
  key,
}: {
  index: number;
  key: (typeof signup.options)[0];
}) => (
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
