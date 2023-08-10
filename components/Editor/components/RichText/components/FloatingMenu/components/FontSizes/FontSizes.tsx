import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiChevronDown } from "react-icons/fi";

import useContainer from "./useContainer";

const FontSizes = () => {
  const { fontSizes, selectedFontSize, handleChangeFontSize } = useContainer();

  return (
    <>
      <div className="w-fit">
        <Listbox value={selectedFontSize}>
          <div className="relative">
            <Listbox.Button className="relative w-fit cursor-pointer border rounded-[5px] bg-white h-6 pl-3 pr-10 text-left shadow-md focus:outline-none">
              <span className="block text-sm">{selectedFontSize.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FiChevronDown />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-y-scroll rounded-[5px] bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {fontSizes.map((fontsize, fontSizeIdx) => (
                  <Listbox.Option
                    key={fontSizeIdx}
                    className={() =>
                      `relative cursor-pointer py-2 text-center hover:bg-edt-secondary ${
                        selectedFontSize.value === fontsize.value
                          ? "bg-edt-secondary"
                          : ""
                      }`
                    }
                    onClick={() => handleChangeFontSize(fontsize)}
                    value={fontsize.value}
                  >
                    {() => (
                      <>
                        <span className="">{fontsize.name}</span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  );
};

export default FontSizes;
