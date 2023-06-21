import { useState } from "react";
import { BsCheckSquareFill } from "react-icons/bs";
import SelectBox from "./SelectBox";

interface SelectGroupProps {
  label: string,
  name: string,
  options: Array<{
    label: string;
    value: string;
  }>;
  isYesOnly: boolean,
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, name, options, isYesOnly }) => {
  const [value, setValue] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const [showInput, setShowInput] = useState<boolean>(false);
  const awardOption = [{ label: "Non-Clinical Assistant or Associate Professorships", value: "Non-Clinical Assistant or Associate Professorships" }];
  const awardYearOption = [{ label: "2024", value: "2024" }]
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const selectOption = (option: string, e: any) => {
    if (!value.includes(option) && (option == "Scholar")) {
      setShowInput(true);
    } else {
      if ((option == "Scholar")) {
        setShowInput(false);
        setInputValue("");
      }
    }
    if (value.includes(option)) {
      setValue(value.filter(item => item != option));
    } else {
      setValue([...value, option]);
    }
  }
  return (
    <div className="relative">
      <label>{label}</label>
      <input name={name} value={JSON.stringify(value)} onChange={() => { }} className="absolute opacity-0 h-0 pointer-events-none overflow-hidden" />
      <div style={{ paddingBlock: "1vh" }}>
        {isYesOnly ? (
          <ul className="overflow-y-auto flex">
            {
              options.map((option, index) => (
                <li
                  className="px-2 py-1 flex justify-start items-center gap-2 cursor-pointer w-[20%]"
                  key={"check_" + index}
                  onClick={(e) => { selectOption(option.value, e) }}
                >
                  <div
                    className={[
                      "card-rounded overflow-hidden cursor-pointer",
                      value.includes(option.value) ? "bg-gray-500" : "bg-white"
                    ].join(" ")}
                  >
                    <BsCheckSquareFill className="text-white" size={40} />
                  </div>
                  {option.label}
                </li>
              ))
            }
          </ul>
        ) : (
          <ul className="overflow-y-auto">
            {
              options.map((option, index) => (
                <div key={index}>
                  <li
                    className={[
                      "px-2 py-1 flex justify-start items-center gap-2 cursor-pointer w-full",
                      (showInput && option.label == "Scholar") && "flex-wrap",
                    ].join(" ")}
                    key={"check_" + index}
                    onClick={(e) => { selectOption(option.value, e) }}
                  >
                    <div
                      className={[
                        "card-rounded overflow-hidden cursor-pointer",
                        value.includes(option.value) ? "bg-gray-500" : "bg-white"
                      ].join(" ")}
                    >
                      <BsCheckSquareFill className="text-white" size={40} />
                    </div>
                    {option.label}
                    {option.label == "Other (Please specify)" && (
                      <div className="ml-[77px]">
                        <input name="other" className=" bg-white border-none px-2 card-rounded  text-black medium-input-box card-rounded" style={{ margin: "auto" }} />
                      </div>
                    )}
                  </li>
                  {(showInput && option.label == "Scholar") &&
                    (<>
                      <div className="flex">
                        <SelectBox
                          label="Award name"
                          options={awardOption}
                          inputSize="large-input-box"
                        />
                      </div>
                      <div className="flex">
                        <SelectBox
                          label="Award year"
                          options={awardYearOption}
                          inputSize="large-input-box"
                        />
                      </div>
                      <div className="flex mb-2">
                        <div className="w-full">
                          <label>Institution</label>
                          <div className="relative inline-block text-left">
                            <input name="institution" className=" bg-white border-none px-2 card-rounded  text-black large-input-box card-rounded" style={{ margin: "auto" }} />
                          </div>
                        </div>
                      </div>
                    </>
                    )
                  }
                </div>
              ))
            }
          </ul>
        )}

      </div>
    </div >
  );
}

export default SelectGroup;