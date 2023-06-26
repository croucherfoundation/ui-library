import { FieldErrors, FieldValues } from "react-hook-form";

export const truncate = (str: string, num: number) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

export const getErrorByName = (errors: FieldErrors<FieldValues>,name: string) => {
    const error = errors[name];
    if(error){
        const message = error?.message?.toString();
        return  message ? message : "";
    }
    return ""
    
}