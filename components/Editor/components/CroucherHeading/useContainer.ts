import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useEffect, useState } from "react";
import { sectionValueUpdater } from "../../helpers";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const useContainer = ({ sectionId, containerId, elementId }: Props) => {
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);
  const [isEditMode] = useEditorConfigStore((state) => [state.isEditMode]);
  const [heading, setHeading] = useState<string>("");

  const handleSetHeading = (text: string) => {
    const clonedSections = cloneDeep(sections);
    const {
      currentSectionIdx,
      currentContainerIdx,
      currentElementIdx,
      currentSection,
      currentContainer,
      currentElement,
    } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    if (currentElement !== null) currentElement.content.heading = text;
    setHeading(text);

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
  };

  useEffect(() => {
    const clonedSections = cloneDeep(sections);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    if (currentElement?.content.heading) {
      const value = currentElement?.content.heading;
      if (value) {
        setHeading(value);
      }
    }
  }, [sectionId, containerId, elementId, sections, setHeading]);

  return {
    heading,
    isEditMode,
    handleSetHeading,
  };
};

export default useContainer;
