import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { sectionValueUpdater } from "../../../../../helpers";
import useSectionStore from "../../../../../store/section.store";
import bgColors from "../../../../../utils/bgColors";
import { useEffect } from "react";

interface PaddingFormValues {
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
}
const PaddingSchema = yup.object().shape({
  paddingTop: yup.number().min(0).required(),
  paddingLeft: yup.number().min(0).required(),
  paddingBottom: yup.number().min(0).required(),
  paddingRight: yup.number().min(0).required(),
});

const useContainer = () => {
  // breakpoint should be respoinsive
  const [
    sections,
    selectedItem,
    updateEnSection,
    updateHkSection,
    selectedContainer,
    breakpoint,
  ] = useSectionStore((state) => [
    state.section,
    state.selectedItem,
    state.updateEnSection,
    state.updateHkSection,
    state.selectedContainer,
    state.breakpoint,
  ]);
  const {
    register: paddingRegister,
    formState: { errors: paddingErrors },
    handleSubmit: paddingHandleSubmit,
    control: paddingControl,
    setValue: paddingSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(PaddingSchema),
    defaultValues: {
      paddingTop: 0,
      paddingLeft: 0,
      paddingBottom: 0,
      paddingRight: 0,
    },
  });

  const handleOnChangeSectionBackgroundColor = (bgColor: string) => {
    const handleEnBackgroundChange = () => {
      const sectionId = selectedItem?.sectionId;
      const containerId = selectedItem?.id;
      if (!sectionId || !containerId) return;
      const clonedSections = cloneDeep(sections["en"]);

      const {
        currentSectionIdx,
        currentContainerIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: null,
      });

      if (currentContainer) {
        currentContainer.style.background.normal.bgColor = bgColor;
      }

      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateEnSection(clonedSections);
    };
    const handleHkBackgroundChange = () => {
      const sectionId = selectedItem?.sectionId;
      const containerId = selectedItem?.id;
      if (!sectionId || !containerId) return;
      const clonedSections = cloneDeep(sections["hk"]);

      const {
        currentSectionIdx,
        currentContainerIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: null,
      });

      if (currentContainer) {
        currentContainer.style.background.normal.bgColor = bgColor;
      }

      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateHkSection(clonedSections);
    };

    handleEnBackgroundChange();
    handleHkBackgroundChange();
  };

  const removeChildElements = () => {
    const removeEnChildElements = () => {
      const sectionId = selectedItem?.sectionId;
      const containerId = selectedItem?.id;
      if (!sectionId || !containerId) return;

      const clonedSections = cloneDeep(sections["en"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: null,
      });

      currentContainer.children = [];

      // replace container data
      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      // replace section value
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateEnSection(clonedSections);
    };
    const removeHkChildElements = () => {
      const sectionId = selectedItem?.sectionId;
      const containerId = selectedItem?.id;
      if (!sectionId || !containerId) return;

      const clonedSections = cloneDeep(sections["hk"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: null,
      });

      currentContainer.children = [];

      // replace container data
      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      // replace section value
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateHkSection(clonedSections);
    };

    removeEnChildElements();
    removeHkChildElements();
  };

  const handlePaddingFormSubmit: SubmitHandler<PaddingFormValues> = (
    data: PaddingFormValues
  ) => {
    const handleEnPaddingChange = () => {
      const clonedSections = cloneDeep(sections["en"]);
      const { currentContainerIdx, currentSection, currentContainer } =
        sectionValueUpdater({
          sections: clonedSections,
          sectionId: selectedItem?.sectionId ? selectedItem.sectionId : "",
          containerId: selectedItem ? selectedItem.id : "",
        });

      if (currentContainer) {
        const bkPoint = currentContainer?.style?.padding[breakpoint];
        if (bkPoint) {
          currentContainer.style.padding[breakpoint].paddingTop =
            data.paddingTop;
          currentContainer.style.padding[breakpoint].paddingLeft =
            data.paddingLeft;
          currentContainer.style.padding[breakpoint].paddingBottom =
            data.paddingBottom;
          currentContainer.style.padding[breakpoint].paddingRight =
            data.paddingRight;
        }

        currentSection.children.splice(
          currentContainerIdx,
          1,
          currentContainer
        );
        updateEnSection(clonedSections);
      } else {
        return;
      }
    };
    const handleHkPaddingChange = () => {
      const clonedSections = cloneDeep(sections["hk"]);
      const { currentContainerIdx, currentSection, currentContainer } =
        sectionValueUpdater({
          sections: clonedSections,
          sectionId: selectedItem?.sectionId ? selectedItem.sectionId : "",
          containerId: selectedItem ? selectedItem.id : "",
        });

      if (currentContainer) {
        const bkPoint = currentContainer?.style?.padding[breakpoint];
        if (bkPoint) {
          currentContainer.style.padding[breakpoint].paddingTop =
            data.paddingTop;
          currentContainer.style.padding[breakpoint].paddingLeft =
            data.paddingLeft;
          currentContainer.style.padding[breakpoint].paddingBottom =
            data.paddingBottom;
          currentContainer.style.padding[breakpoint].paddingRight =
            data.paddingRight;
        }

        currentSection.children.splice(
          currentContainerIdx,
          1,
          currentContainer
        );
        updateHkSection(clonedSections);
      } else {
        return;
      }
    };

    handleEnPaddingChange();
    handleHkPaddingChange();
  };

  // set selected [section-padding] to [form-fields]
  useEffect(() => {
    paddingSetValue(
      "paddingTop",
      selectedContainer?.style.padding[breakpoint].paddingTop as number
    );
    paddingSetValue(
      "paddingLeft",
      selectedContainer?.style.padding[breakpoint].paddingLeft as number
    );
    paddingSetValue(
      "paddingBottom",
      selectedContainer?.style.padding[breakpoint].paddingBottom as number
    );
    paddingSetValue(
      "paddingRight",
      selectedContainer?.style.padding[breakpoint].paddingRight as number
    );
  }, [selectedContainer, paddingSetValue, breakpoint]);

  return {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    removeChildElements,
    paddingRegister,
    paddingErrors,
    paddingHandleSubmit,
    paddingControl,
    handlePaddingFormSubmit,
  };
};

export default useContainer;
