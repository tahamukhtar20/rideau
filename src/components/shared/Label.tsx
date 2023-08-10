import React from "react";

export const Label = ({
  label,
  required,
}: {
  label: string;
  required: boolean;
}) => (
  <td className="label font-black ml-1 lg:self-center lg:w-1/3 ">
    <span className="label-text whitespace-nowrap">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
  </td>
);
