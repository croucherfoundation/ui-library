import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useSectionStore from "./store/section.store";
import { type LayoutState } from "./types/section.t";
import generatedLayoutInfo from "./utils/generateLayoutInfo";

const useContainer = () => {
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);
  const [isEditMode] = useState<boolean>(true);

  const getGenerateGridCol = useCallback(
    (layout: LayoutState, index: number) => {
      const layoutSmall =
        layout.sm.split("_").filter((n) => n != "")[index] || "12";
      const layoutMd =
        layout.md.split("_").filter((n) => n != "")[index] || "12";
      const layoutLg =
        layout.lg.split("_").filter((n) => n != "")[index] || "12";
      return `col-span-${layoutSmall} md:col-span-${layoutMd} lg:col-span-${layoutLg}`;
    },
    []
  );

  const handleCreateContainer = (containerType: string) => {
    const containerArray = [];
    for (let i = 0; i < generatedLayoutInfo(containerType); i++) {
      containerArray.push({
        id: uuidv4(),
        type: "container",
        option: {
          contentWidth: "100%",
          minWidth: "",
          minHeight: "",
          direction: "",
          justifyContent: "",
          alignContent: "",
          gap: 0,
        },
        style: {
          background: {
            normal: {
              type: "",
              bgColor: "#f1f5f9",
            },
            hover: {
              type: "",
              bgColor: "",
            },
          },
          border: {
            normal: {
              borderType: "",
              radius: {
                top: 4,
                left: 4,
                bottom: 4,
                right: 4,
                isLinked: true,
              },
              boxShadow: {},
            },
            hover: {
              borderType: "",
            },
          },
        },
        children: [],
      });
    }
    return containerArray;
  };

  const handleCreateSection = (containerType: string) => {
    const sectionArray = [...sections];
    const sectionObj = {
      id: uuidv4(),
      type: "section",
      layoutStyle: {
        lg: containerType,
        md: "_12",
        sm: "_12",
      },
      option: {
        contentWidth: "",
        minWidth: "",
        minHeight: "100px",
        direction: "",
        justifyContent: "",
        alignContent: "",
        gap: 3,
        screen: {},
      },
      style: {
        background: {
          normal: {
            type: "",
            bgColor: "",
          },
          hover: {
            type: "",
            bgColor: "",
          },
        },
        border: {
          normal: {
            borderType: "", // none, solid, doubld, dashed, dotted, wavy
            radius: {
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              isLinked: true,
            },
            boxShadow: {},
          },
          hover: {
            borderType: "", // none, solid, doubld, dashed, dotted, wavy
          },
        },
      },
      children: [],
    };
    // @ts-ignore
    sectionObj.children = handleCreateContainer(containerType);
    sectionArray.push(sectionObj);
    updateSection(sectionArray);
  };

  return {
    sections,
    handleCreateSection,
    isEditMode,
    getGenerateGridCol,
  };
};

export default useContainer;
