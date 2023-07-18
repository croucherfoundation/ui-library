import { cloneDeep, fill, findIndex } from "lodash";
import useSectionStore from "../../../../store/section.store";

const bgColors = [
  {
    id: "#F3F3F0",
    value: "#F3F3F0",
  },
  {
    id: "#FFFFFF",
    value: "#FFFFFF",
  },
];

const useContainer = () => {
  const [sections, updateSection, selectedSection] = useSectionStore(
    (state) => [state.section, state.updateSection, state.selectedSection]
  );

  const handleOnChangeSectionBackgroundColor = (bgColor: string) => {
    const clonedSections = cloneDeep(sections);
    const clonedSelectedSection = cloneDeep(selectedSection);
    const currentSectionIdx = findIndex(
      clonedSections,
      (section) => section.id === selectedSection?.id
    );
    if (clonedSelectedSection) {
      clonedSelectedSection.style.background.normal.bgColor = bgColor;

      clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

      updateSection(clonedSections);
    } else {
      return;
    }
  };

  return {
    bgColors,
    handleOnChangeSectionBackgroundColor,
  };
};

export default useContainer;
