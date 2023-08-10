import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import { type LayoutState } from "../../types/section.t";
import generatedLayoutInfo from "../../utils/generateLayoutInfo";

const useContainer = () => {
  const [sections, updateEnSection, updateHkSection] = useSectionStore(
    (state) => [state.section, state.updateEnSection, state.updateHkSection]
  );
  const [lan, isEditMode, previewMode] = useEditorConfigStore((state) => [
    state.lan,
    state.isEditMode,
    state.config.previewMode,
  ]);

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
              bgColor: "",
            },
            hover: {
              type: "",
              bgColor: "",
            },
          },
          padding: {
            sm: {
              paddingTop: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              paddingRight: 0,
            },
            md: {
              paddingTop: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              paddingRight: 0,
            },
            lg: {
              paddingTop: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              paddingRight: 0,
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
    const sectionArray = [...sections["en"]];
    const sectionHkArray = [...sections["hk"]];
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
        maxWidth: {
          sm: 358,
          md: 1218,
          lg: 1218,
        },
        minHeight: "100px",
        direction: "",
        justifyContent: "",
        alignContent: "",
        gap: 0,
        screen: {},
        unit: {
          sm: "px",
          md: "px",
          lg: "px",
        },
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
        padding: {
          sm: {
            paddingTop: 38,
            paddingLeft: 16,
            paddingBottom: 38,
            paddingRight: 16,
          },
          md: {
            paddingTop: 0,
            paddingLeft: 0,
            paddingBottom: 0,
            paddingRight: 0,
          },
          lg: {
            paddingTop: 60,
            paddingLeft: 152,
            paddingBottom: 60,
            paddingRight: 152,
          },
        },
        margin: {
          sm: {
            marginTop: 0,
            marginLeft: 0,
            marginBottom: 0,
            marginRight: 0,
          },
          md: {
            marginTop: 0,
            marginLeft: 0,
            marginBottom: 0,
            marginRight: 0,
          },
          lg: {
            marginTop: 0,
            marginLeft: 0,
            marginBottom: 0,
            marginRight: 0,
          },
        },
      },
      children: [],
    };
    // @ts-ignore
    sectionObj.children = handleCreateContainer(containerType);
    sectionArray.push(sectionObj);
    sectionHkArray.push(sectionObj);
    updateEnSection(sectionArray);
    updateHkSection(sectionHkArray);
  };

  return {
    sections,
    handleCreateSection,
    isEditMode,
    previewMode,
    getGenerateGridCol,
    lan,
  };
};

export default useContainer;
