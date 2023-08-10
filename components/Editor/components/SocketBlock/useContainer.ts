import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useMemo } from "react";
import { useDrop } from "react-dnd";
import { sectionValueUpdater } from "../../helpers";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import { Container } from "../../types/container.t";
import createChilds from "../../utils/createChilds";

interface Props {
  containerId: string;
  sectionId: string;
}

const useContainer = ({ containerId, sectionId }: Props) => {
  const [sections, updateEnSection, updateHkSection] = useSectionStore(
    (state) => [state.section, state.updateEnSection, state.updateHkSection]
  );
  const [previewMode, isEditMode, handleTabName] = useEditorConfigStore(
    (state) => [state.config.previewMode, state.isEditMode, state.handleTabName]
  );
  const [selectedItem, updateSelectedItem, updateSelectedContainer] =
    useSectionStore((state) => [
      state.selectedItem,
      state.updateSelectedItem,
      state.updateSelectedContainer,
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
    const createEnContainerChildren = () => {
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
      currentContainer?.children.push(createChilds(elementType));

      // replace container data
      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      // replace section value
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateEnSection(clonedSections);
    };
    const creatHkContainerChildren = () => {
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
      currentContainer?.children.push(createChilds(elementType));

      // replace container data
      fill(currentSection?.children, currentContainer, currentContainerIdx, 1);

      // replace section value
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateHkSection(clonedSections);
    };

    createEnContainerChildren();
    creatHkContainerChildren();
  };

  const removeChildElements = () => {
    const removeEnContainer = () => {
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
    const removeHkContainer = () => {
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

    removeEnContainer();
    removeHkContainer();
  };

  const onSelectedContainer = (container: Container, sectionId: string) => {
    const isAlreadySelected =
      containerId === selectedItem?.id &&
      selectedItem?.elementType === "container";

    if (isAlreadySelected) {
      updateSelectedContainer(null);
      updateSelectedItem(null);
      handleTabName("editor");
      return;
    }

    updateSelectedItem({
      id: container.id,
      elementType: "container",
      sectionId: sectionId,
    });

    updateSelectedContainer(container);
    handleTabName("setting");
  };

  const isSelectedContainer = useMemo<boolean>(() => {
    return (
      containerId === selectedItem?.id &&
      selectedItem?.elementType === "container"
    );
  }, [containerId, selectedItem?.elementType, selectedItem?.id]);

  return {
    isActive,
    dropRef,
    previewMode,
    removeChildElements,
    onSelectedContainer,
    onSelectedContainer,
    isEditMode,
    isSelectedContainer,
    isSelectedContainer,
  };
};

export default useContainer;
