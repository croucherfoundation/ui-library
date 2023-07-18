import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useCallback, useEffect, useState } from "react";
import { sectionValueUpdater } from "../../helpers";
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
  const [heading, setHeading] = useState<string>("");

  const handleSetHeading = useCallback(
    (text: string) => {
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

      fill(
        currentContainer.children,
        currentElement,
        currentElementIdx ?? 0,
        1
      );
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateSection(clonedSections);
    },
    [heading]
  );

  useEffect(() => {
    handleSetHeading(heading);
  }, [heading, handleSetHeading]);

  useEffect(() => {
    const clonedSections = cloneDeep(sections);
    const {
      currentElement,
    } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    if (currentElement?.content.heading) {
      // console.log(currentElement?.content.body[bodyKey]);
      const value = currentElement?.content.heading;
      if (value) {
        setHeading(value);
      }
    }

  }, [])

  

  return {
    heading,
    setHeading,
  };
};

export default useContainer;
