import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Controller } from "react-hook-form";
import { FiSettings } from "react-icons/fi";
import useContainer from "./useContainer";
import useEditorConfigStore from "../../store/editorConfig.store";
import If from "../If";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const LinkButton = ({ containerId, sectionId, elementId }: Props) => {
  const {
    control,
    handleSubmit,
    handleButtonLinkForm,
    errors,
    isValid,
    buttonText,
  } = useContainer({ containerId, sectionId, elementId });
  const [previewMode, isEditMode] = useEditorConfigStore((state) => [
    state.config.previewMode,
    state.isEditMode,
  ]);
  return (
    <>
      <div className="flex items-center gap-2">
        <button className="font-bold h-[40px] w-[177px] text-[18px] hover:bg-[#ef3e42] hover:text-white hover:border-none rounded-[20px] border border-[#020202] pt-[2px]">
          {buttonText}
        </button>

        <If isTrue={isEditMode}>
          <If isTrue={!previewMode}>
            <Menu>
              <div className="">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button>
                      <FiSettings className="stroke-slate-500" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute bottom-0 right-0 mt-2 w-64 rounded-[5px] bg-white shadow-lg p-3 z-50">
                      <form
                        className="grid grid-cols-1 gap-3"
                        onSubmit={(e) =>
                          void handleSubmit(handleButtonLinkForm)(e)
                        }
                      >
                        <Controller
                          control={control}
                          name="buttonText"
                          render={({ field }) => (
                            <>
                              <div>
                                <label
                                  htmlFor="link-text"
                                  className="text-slate-500 text-sm"
                                >
                                  Button text
                                </label>
                                <input
                                  type="text"
                                  id="link-text"
                                  placeholder="Enter button text"
                                  className={`w-full px-2 border rounded-[5px] focus:outline-none ${
                                    errors.buttonText ? "border-red-500" : ""
                                  }`}
                                  {...field}
                                  onKeyDown={(e) => {
                                    const allowedHeadlessUIKeys = [
                                      "ArrowUp",
                                      "ArrowDown",
                                      "Enter",
                                      "Space", // Space Key
                                      "Home",
                                      "End",
                                      "Escape",
                                    ];
                                    if (
                                      !allowedHeadlessUIKeys.includes(e.key)
                                    ) {
                                      e.stopPropagation();
                                    }
                                  }}
                                />
                              </div>
                            </>
                          )}
                        />

                        <Controller
                          name="buttonUrl"
                          control={control}
                          render={({ field }) => (
                            <>
                              <div>
                                <label
                                  htmlFor="link-url"
                                  className="text-slate-500 text-sm"
                                >
                                  Button link
                                </label>
                                <input
                                  type="text"
                                  id="link-url"
                                  placeholder="eg: https://www.google.com/"
                                  className={`w-full px-2 border rounded-[5px] focus:outline-none ${
                                    errors.buttonUrl ? "border-red-500" : ""
                                  }`}
                                  {...field}
                                  onKeyDown={(e) => {
                                    const allowedHeadlessUIKeys = [
                                      "ArrowUp",
                                      "ArrowDown",
                                      "Enter",
                                      "Space", // Space Key
                                      "Home",
                                      "End",
                                      "Escape",
                                    ];
                                    if (
                                      !allowedHeadlessUIKeys.includes(e.key)
                                    ) {
                                      e.stopPropagation();
                                    }
                                  }}
                                />
                              </div>
                            </>
                          )}
                        />

                        <div className="flex justify-end">
                          <button
                            disabled={!isValid}
                            type="submit"
                            className={`px-3 py-1  text-white text-sm rounded-[5px] ${
                              isValid
                                ? "bg-[#73b77a]"
                                : "bg-[#F3F3F0] cursor-not-allowed"
                            }`}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </Menu>
          </If>
        </If>
      </div>
    </>
  );
};

export default LinkButton;
