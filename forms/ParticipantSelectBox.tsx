import { truncate as truncateValue } from "@/utils/helpers";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import {
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from "react-hook-form";

interface ParticipantSelectBoxProps {
  label: string;
  options:
    | Array<{
        label: string;
        value: string;
      }>
    | [];
  inputSize: string;
  register?: UseFormRegisterReturn<string>;
  setValue?: UseFormSetValue<FieldValues>;
  error?: string;
  pickFirst?: boolean;
  truncate?: number;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
}

const ParticipantSelectBox: React.FC<ParticipantSelectBoxProps> = ({
  label,
  options,
  inputSize,
  register,
  setValue,
  error,
  pickFirst = false,
  truncate,
  onValueChange,
  defaultValue,
}) => {
  const [value, setCurrentValue] = useState<string>("");
  const [labelValue, setLabelValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const [showInput, setShowInput] = useState<boolean>(false);
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };
  let inputParticipantSelectBoxSize = "";
  switch (inputSize) {
    case "small-input-box":
      inputParticipantSelectBoxSize = "176px";
      break;
    case "medium-input-box":
      inputParticipantSelectBoxSize = "281px";
      break;
    default:
      inputParticipantSelectBoxSize = "592px";
  }
  const focus: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLButtonElement;
    target.focus();
  };

  const chooseOption: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as any;
    if (setValue)
      setValue(
        register?.name ? register?.name : "",
        target.getAttribute("data-value")
      );

    setCurrentValue(target.getAttribute("data-value"));
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

  const closeOption: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    const target = e.target as any;
    if (target.tagName != "BUTTON") {
      target.closest("button")?.blur();
    }
    
  };

  useEffect(() => {
    if (!defaultValue && pickFirst && options.length > 0) {
      setCurrentValue(options[0].value);
      setLabelValue(options[0].label);
      (register?.name && setValue) && setValue(register?.name, options[0].value);
      
    } else if (defaultValue) {
      const find = options.find((item) => item.value == defaultValue);
      if (find) {
        setCurrentValue(defaultValue);
        setLabelValue(defaultValue);

        defaultValue &&
          setValue &&
          register?.name &&
          setValue(register?.name, defaultValue);
      }
    }
  }, [defaultValue, pickFirst]);

  return (
    <>
      <div className="relative flex flex-col">
        <input
          name={register?.name}
          value={value}
          onChange={() => {}}
          {...register}
          className="absolute opacity-0 pointer-events-none"
        />
        <label>{label}</label>
        <div className="inline-block text-left">
          <div className={inputSize}>
            <button
              type="button"
              className="relative inline-flex w-full justify-between rounded-md bg-sym-gray px-4 py-3 text-sm font-medium text-black border-[1px] border-black focus:outline-none focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-100 group"
              onClick={focus}
            >
              {labelValue
                ? truncate
                  ? truncateValue(labelValue, 15)
                  : labelValue
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
              <div className="absolute top-0 left-0 hidden group-focus:inline-flex w-full justify-between rounded-md bg-sym-gray px-4 py-3 text-sm font-medium text-black border-[1px] border-black focus:outline-none focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-100 group opacity-0" onClick={closeOption}>
              {labelValue
                ? truncate
                  ? truncateValue(labelValue, 15)
                  : labelValue
                : "Options"}
              </div>
              <div
                className="absolute left-0 z-10 mt-8 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-focus:flex group-focus-visible:flex group-visited:flex justify-start overflow-hidden"
              >
                <div className="w-full">
                  {options.map((option, index) => (
                    <div
                      className="text-gray-700 block px-4 py-3 text-sm text-left hover:bg-gray-400 hover:text-white pointer-events-auto"
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
      <div className="text-red-500 ml-2 mt-2">{error}</div>
    </>
  );
};

export default ParticipantSelectBox;
