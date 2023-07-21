import { findIndex } from "lodash";
import find from "lodash/find";
import { type Container } from "./types/container.t";
import { type Element } from "./types/element.t";
import { type SectionState } from "./types/section.t";

interface SectionValueUpdaterProps {
  sections: SectionState[];
  sectionId: string;
  containerId: string;
  elementId?: string | null;
}
export const sectionValueUpdater = ({
  sections,
  sectionId,
  containerId,
  elementId,
}: SectionValueUpdaterProps) => {
  const currentSection = find(
    sections,
    (section) => section.id === sectionId
  ) as SectionState;
  const currentContainer = find(
    currentSection?.children,
    (container) => container.id === containerId
  ) as Container;
  const currentElement = elementId
    ? (find(
        currentContainer.children,
        (elm: Element) => elm.id === elementId
      ) as Element)
    : null;

  const currentSectionIdx = findIndex(
    sections,
    (section) => section.id === sectionId
  );
  const currentContainerIdx = findIndex(
    currentSection.children,
    (container: Container) => container.id === containerId
  );

  const currentElementIdx = elementId
    ? findIndex(
        currentContainer.children,
        (container: Element) => container.id === containerId
      )
    : null;

  return {
    currentSectionIdx,
    currentContainerIdx,
    currentElementIdx,
    currentSection,
    currentContainer,
    currentElement,
  };
};
