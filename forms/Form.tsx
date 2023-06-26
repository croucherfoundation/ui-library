import { HTMLProps, ReactNode } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import type { Response } from "../types/api";

type Props = Omit<HTMLProps<HTMLFormElement>, "children"> & {
  children: ReactNode | ((arg: UseFormReturn & { values: any }) => ReactNode);
  defaults?: object;
  customForm?: UseFormReturn<object, any>;
  handleSubmit: (data: any) => Promise<void>;
};

const Form = ({
  defaults,
  children,
  customForm,
  handleSubmit,
  ...rest
}: Props) => {
  const defaultForm = useForm({
    defaultValues: defaults,
    mode: "onChange",
  });

  const form = customForm ? customForm : defaultForm;

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
