// import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
// import filter from "lodash/filter";
// import { useEffect } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import * as yup from "yup";
import useSectionStore from "../../../../../store/section.store";
import bgColors from "../../../../../utils/bgColors";
import { sectionValueUpdater } from "../../../../../helpers";
import { fill } from "lodash";

// interface PaddingFormValues {
//   paddingTop: number;
//   paddingLeft: number;
//   paddingBottom: number;
//   paddingRight: number;
// }

// const PaddingSchema = yup.object().shape({
//   paddingTop: yup.number().min(0).required(),
//   paddingLeft: yup.number().min(0).required(),
//   paddingBottom: yup.number().min(0).required(),
//   paddingRight: yup.number().min(0).required(),
// });

const useContainer = () => {
  const [
    sections,
    selectedItem,
    updateSection,
  ] = useSectionStore((state) => [
    state.section,
    state.selectedItem,
    state.updateSection,
    state.updateSelectedSection,
    state.updateSelectedItem,
  ]);

  const handleOnChangeSectionBackgroundColor = (bgColor: string) => {
    const sectionId = selectedItem?.sectionId;
    const containerId = selectedItem?.id;
    if (!sectionId || !containerId) return;
    const clonedSections = cloneDeep(sections);

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

    console.log(
      currentSectionIdx,
      currentContainerIdx,
      currentSection,
      currentContainer
    );

    if (currentContainer) {
      currentContainer.style.background.normal.bgColor = bgColor;
    }

    fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);

  };

  return {
    bgColors,
    handleOnChangeSectionBackgroundColor,
  };
};

export default useContainer;
