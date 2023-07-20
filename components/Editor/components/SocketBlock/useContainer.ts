import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useDrop } from "react-dnd";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";
import createChilds from "../../utils/createChilds";
import useEditorConfigStore from "../../store/editorConfig.store";

interface Props {
  containerId: string;
  sectionId: string;
}

const useContainer = ({ containerId, sectionId }: Props) => {
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);
  const [previewMode, isEditMode] = useEditorConfigStore((state) => [
    state.config.previewMode,
    state.isEditMode,
  ]);

  const [{ isActive }, dropRef] = useDrop(
    () => ({
      accept: "element",
      collect: (monitor) => ({
        isActive: monitor.canDrop() && monitor.isOver(),
      }),
      drop: (item: { type: string }) => {
        handleCreateContainerChildren(item?.type);
      },
    }),
    [sections]
  );

  const handleCreateContainerChildren = (elementType: string) => {
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
    currentContainer?.children.push(createChilds(elementType));

    // replace container data
    fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

    // replace section value
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
  };

  const removeChildElements = () => {
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

    currentContainer.children = [];

    // replace container data
    fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

    // replace section value
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
  };

  return {
    isActive,
    dropRef,
    previewMode,
    removeChildElements,
    isEditMode,
  };
};

export default useContainer;
