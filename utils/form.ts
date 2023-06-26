import { FieldErrors, FieldValues } from "react-hook-form";

export const getErrorByName = (
  errors: FieldErrors<FieldValues>,
  name: string
) => {
  const error = errors[name];
  if (error) {
    const message = error?.message?.toString();
    return message ? message : "";
  }
  return "";
};
