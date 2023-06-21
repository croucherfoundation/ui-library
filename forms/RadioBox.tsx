import { useEffect, useState } from "react";
import { BsCheckSquareFill } from "react-icons/bs";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

interface RadioBoxProps {
  label: string;
  name: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  isHorizontal: boolean;
  defaultValue?: string;
  required?: boolean;
  required_message?: string;
  onValueChange?: (value: string | null) => void;
}

const RadioBox: React.FC<RadioBoxProps> = ({
  label,
  name,
  options,
  isHorizontal,
  defaultValue,
  onValueChange,
  required,
  required_message,
}) => {
  const [value, setCurrentValue] = useState<any[]>([]);
  const { register, setValue } = useFormContext();
  const isRequired = required ? required : false;
  const radioBoxRegister = register(name, {
    required: {
      value: isRequired,
      message:
        isRequired && required_message
          ? required_message
          : `Please select ${name} field`,
    },
  });

  const selectOption = (option: string, e: any) => {
    if (value.includes(option)) {
      setCurrentValue(value.filter((item) => item != option));
      setValue(
        name,
        value.filter((item) => item != option)
      );
      onValueChange && onValueChange(null);
    } else {
      setCurrentValue([option]);
      setValue(name, [option]);
      onValueChange && onValueChange(option);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      const find = options.find((item) => item.value == defaultValue);
      if (find) {
        setCurrentValue([defaultValue]);
        setValue(name, value);
        onValueChange && onValueChange(defaultValue);
      }
    } else {
      setValue(name, null);
    }
  }, [defaultValue]);
  return (
    <div className="relative">
      <input
        name={name}
        ref={radioBoxRegister?.ref}
        value={JSON.stringify(value)}
        onChange={() => {}}
        className="absolute pointer-events-none opacity-0"
      />
      <input
        ref={radioBoxRegister?.ref}
        className="absolute pointer-events-none opacity-0"
      />
      <label>{label}</label>
      <div style={{ paddingBlock: "1vh" }}>
        <ul className={clsx(isHorizontal && "flex", "overflow-y-auto gap-5")}>
          {options.map((option, index) => (
            <li
              className={clsx(
                isHorizontal ? "w-[20%]" : "w-full",
                "py-1 flex justify-start items-center gap-[10px] cursor-pointer"
              )}
              key={"check_" + index}
              onClick={(e) => {
                selectOption(option.value, e);
              }}
            >
              <div
                className={[
                  "card-rounded overflow-hidden cursor-pointer aspect-square flex justify-center items-center w-[40px]",
                  value.includes(option.value) ? "bg-gray-500" : "bg-white",
                ].join(" ")}
              >
                <BsCheckSquareFill className="text-white" size={40} />
              </div>
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RadioBox;
