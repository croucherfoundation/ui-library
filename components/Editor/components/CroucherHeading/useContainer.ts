import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useEffect, useState } from "react";
import { sectionValueUpdater } from "../../helpers";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import { type Element } from "../../types/element.t";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
  element: Element;
}

const useContainer = ({
  sectionId,
  containerId,
  elementId,
  element,
}: Props) => {
  const [sections, updateEnSection, updateHkSection] = useSectionStore(
    (state) => [state.section, state.updateEnSection, state.updateHkSection]
  );
  const [lan, isEditMode, previewMode] = useEditorConfigStore((state) => [
    state.lan,
    state.isEditMode,
    state.config.previewMode,
  ]);
  const [heading, setHeading] = useState<string>("");

  const handleSetHeading = (text: string) => {
    const handleEnHeading = () => {
      const tempCurrentElement = cloneDeep(element);
      const clonedSections = cloneDeep(sections["en"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentElementIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      tempCurrentElement.content.heading = text;
      setHeading(text);

      fill(
        currentContainer.children,
        tempCurrentElement,
        currentElementIdx ?? 0,
        1
      );
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateEnSection(clonedSections);
    };
    const handleHkHeading = () => {
      const tempCurrentElement = cloneDeep(element);
      const clonedSections = cloneDeep(sections["hk"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentElementIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      tempCurrentElement.content.heading = text;
      setHeading(text);

      fill(
        currentContainer.children,
        tempCurrentElement,
        currentElementIdx ?? 0,
        1
      );
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateHkSection(clonedSections);
    };

    if (lan === "en") {
      handleEnHeading();
    } else if (lan === "hk") {
      handleHkHeading();
    }
  };

  useEffect(() => {
    if (lan === "en") {
      const clonedSections = cloneDeep(sections["en"]);
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
    } else if (lan === "hk") {
      const clonedSections = cloneDeep(sections["hk"]);
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
    }
  }, [sectionId, containerId, elementId, sections, lan]);

  return {
    heading,
    isEditMode,
    handleSetHeading,
    previewMode,
  };
};

export default useContainer;
