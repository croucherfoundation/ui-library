import { HTMLProps, ReactNode } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import type { Response } from "../types/api";

type Props = Omit<HTMLProps<HTMLFormElement>, "children"> & {
  children: ReactNode | ((arg: UseFormReturn & { values: any }) => ReactNode);
  defaults?: object;
  handleSubmit: (data: any) => Promise<void>;
};

const Form = ({
  defaults,
  children,
  onError,
  handleSubmit,
  ...rest
}: Props) => {
  const form = useForm({
    defaultValues: defaults,
    mode: "onChange",
  });

  return (
    <FormProvider {...form}>
      <form {...rest} onSubmit={form.handleSubmit(handleSubmit)}>
        {typeof children === "function"
          ? children({ ...form, values: form.getValues() })
          : children}
      </form>
    </FormProvider>
  );
};

export default Form;
