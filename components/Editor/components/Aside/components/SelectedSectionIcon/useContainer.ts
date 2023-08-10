import { useCallback } from "react";
import useEditorConfigStore from "../../../../store/editorConfig.store";
import useSectionStore from "../../../../store/section.store";
import { LayoutState, SectionState } from "../../../../types/section.t";

interface UserContainerProps {
  id: string;
  layoutStyle: LayoutState;
  isSelected: boolean;
  section: SectionState;
}

export function useContainer({
  id,
  layoutStyle,
  isSelected,
  section,
}: UserContainerProps) {
  const [handleTabName] = useEditorConfigStore((state) => [
    state.handleTabName,
  ]);

  const [updateSelectedItem, updateSelectedSection, updateSelectedContainer] =
    useSectionStore((state) => [
      state.updateSelectedItem,
      state.updateSelectedSection,
      state.updateSelectedContainer,
    ]);

  const handleEdit = useCallback(() => {
    updateSelectedItem(
      isSelected
        ? null
        : {
            elementType: "section",
            id,
            layoutStyle,
          }
    );
    updateSelectedSection(isSelected ? null : section);
    updateSelectedContainer(null);
    handleTabName(isSelected ? "editor" : "setting");
  }, [
    id,
    layoutStyle,
    isSelected,
    updateSelectedItem,
    section,
    updateSelectedSection,
    updateSelectedContainer,
    handleTabName,
  ]);

  return {
    handleEdit,
  };
}
