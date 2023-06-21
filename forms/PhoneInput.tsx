import { getErrorByName } from "@/utils/helpers";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa";

interface PhoneInputProps {
  label: string | ReactNode | ReactNode[];
  name: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  defaultValue?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  name,
  register,
  defaultValue,
  errors,
}) => {
    const [value, setValue] = useState([
        {
            id: 1,
            country_code: "+95",
            phone_number: "09973124523"
        },
        {
            id: 2,
            country_code: "+95",
            phone_number: "09973124523"
        },
        {
            id: 3,
            country_code: "+95",
            phone_number: "09973124523"
        },
    ])
  const phoneProps = register(name);
  return (
    <>
      <label className="relative w-full flex flex-col md:flex-row">
        {label}
      </label>
      <div className="relative flex text-left">
        <input
          type="text"
          className={clsx(
            "bg-white px-2  text-black w-[15%] rounded-l-[5px] border-r-2 border-solid border-r-black/5 transition-all duration-[1s] ease-in-out h-[40px]"
          )}
          placeholder="Area code"
        />
        <input
          type="text"
          className={clsx(
            "bg-white border-none px-2  text-black w-[48%] rounded-r-[5px] transition-all duration-[1s] ease-in-out h-[40px]"
          )}
          placeholder="Number"
        />
        <div className="flex px-2 gap-2 w-[30%] items-center">
          <div className="w-[20px] h-[20px] rounded-full bg-black text-white flex justify-center items-center p-[5px] cursor-pointer">
            <FaPlus />
          </div>
          <div className="w-[20px] h-[20px] rounded-full bg-black text-white flex justify-center items-center p-[5px] cursor-pointer">
            <FaMinus />
          </div>
        </div>

        <div className="text-red-500 ml-2 mt-2">
          {getErrorByName(errors, name)}
        </div>
      </div>
    </>
  );
};

export default PhoneInput;
