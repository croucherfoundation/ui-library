import { cloneDeep, filter, findIndex } from "lodash";
import { useState } from "react";
import useSectionStore from "../../../../store/section.store";
import { SectionState } from "../../../../types/section.t";

const useSelectedItem = () => {
  const [sections, updateSection, updateSelectedItem] = useSectionStore(
    (state) => [state.section, state.updateSection, state.updateSelectedItem]
  );

  const defaultBreakPointStyle =
    "flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-700 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 bg-gray-800 focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-500 border hover:border-indigo-500";

  const [breakpoint, setBreakpoint] = useState<"lg" | "md" | "sm">("lg");

  const updateSelectedItemBreakpoints = ({
    sectionId,
    breakpoint,
    breakpointValue,
  }: {
    sectionId: string;
    breakpoint: "lg" | "md" | "sm";
    breakpointValue: string;
  }) => {
    //

    const clonedSections = cloneDeep(sections);
    const isFound = clonedSections.some((sec) => sec.id === sectionId);
    if (!isFound) return;

    const section = clonedSections.find((sec) => sec.id === sectionId);

    if (section) {
      section.layoutStyle[breakpoint] = breakpointValue;

      updateSelectedItem({
        elementType: "section",
        id: section.id,
        layoutStyle: section.layoutStyle,
      });

      const sectionIdx = findIndex(
        clonedSections,
        (section: SectionState) => section.id === sectionId
      );

      clonedSections[sectionIdx].layoutStyle[breakpoint] = breakpointValue;

      updateSection(clonedSections);
    }
  };

  const deleteSelectedSection = ({ sectionId }: { sectionId: string }) => {
    const section = filter(sections, (section) => section.id !== sectionId);

    updateSelectedItem(null);

    updateSection(section);
  };

  return {
    defaultBreakPointStyle,
    breakpoint,
    setBreakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
  };
};

export default useSelectedItem;
