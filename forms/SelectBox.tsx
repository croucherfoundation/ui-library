import useDisplay from "@/hooks/useDisplay";
import { truncate as truncateValue } from "@/utils/helpers";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import {
  useFormContext,
} from "react-hook-form";

interface SelectBoxProps {
  label: string | ReactNode | ReactNode[];
  name: string;
  options:
    | Array<{
        label: string;
        value: string;
      }>
    | [];
  
  truncate?: number;
  defaultValue?: string;
  required?: boolean;
  required_message?: string;
  onValueChange?: (value: string | null) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  label,
  name,
  options,
  truncate,
  defaultValue,
  required,
  required_message,
  onValueChange,
}) => {
  const [labelValue, setLabelValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const [showInput, setShowInput] = useState<boolean>(false);
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const {setValue, watch, register} = useFormContext();
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

  const {windowWidth} = useDisplay();
  let inputSelectBoxSize = "";
  
  
  const chooseOption: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as any;

    setValue(name,target.getAttribute("data-value"));
    onValueChange &&
      onValueChange(
        target.getAttribute("data-value")
          ? target.getAttribute("data-value")
          : ""
      );
    setLabelValue(target.getAttribute("data-label"));
    if (
      target.getAttribute("data-label") == "Other, please specify" ||
      target.getAttribute("data-label") == "其他，請註明"
    ) {
      setShowInput(true);
    } else {
      setShowInput(false);
      setInputValue("");
    }
    if (target.tagName != "BUTTON") {
      target.closest("button")?.blur();
    }
  };

  useEffect(() => {
    if (!defaultValue && options.length > 0) {
      setValue(name,options[0].value);
      setLabelValue(options[0].label);
    } else if (defaultValue) {
      const find = options.find((item) => item.value == defaultValue);
      if (find) {
        setValue(name,defaultValue);
        setLabelValue(find?.label);

        defaultValue &&
          setValue &&
          name &&
          setValue(name, defaultValue);
      }
    }
  }, [defaultValue]);

  return (
    <>
      <div className="relative flex flex-col transition-all duration-[1s] ease-in">
        <input
          {...radioBoxRegister}
          className="absolute opacity-0 pointer-events-none"
        />
        <label>{label}</label>
        <div className="inline-block text-left">
          <div className="w-full h-[40px]">
            <button
              type="button"
              className="relative flex w-full transition-all duration-[1s] ease-in justify-between rounded-md bg-sym-gray px-4 h-[40px] items-center text-sm font-medium text-black border-[1px] border-black focus:outline-none focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-100 group text-start"
            >
              {labelValue
                ? truncate
                  ? truncateValue(labelValue, 15)
                  : windowWidth < 600 ? truncateValue(labelValue, 30) : labelValue
                : "Options"}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              <div
                className="absolute top-0 left-0 z-10 mt-8 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-focus:flex group-focus-visible:flex group-visited:flex justify-start overflow-hidden"
                style={{ width: inputSelectBoxSize }}
              >
                <div className="w-full" style={{ width: "100%" }}>
                  {options.map((option, index) => (
                    <div
                      className="text-gray-700 block px-4 py-2 text-sm text-left hover:bg-gray-400 hover:text-white pointer-events-auto"
                      style={{ width: "100%" }}
                      key={index}
                      onClick={chooseOption}
                      data-value={option.value}
                      data-label={option.label}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          </div>
        </div>
        {showInput && (
          <input
            name={name + "_input"}
            className=" bg-white border-none px-2 card-rounded  text-black h-max"
            value={inputValue}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};

export default SelectBox;
