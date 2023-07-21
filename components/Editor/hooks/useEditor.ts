import { useCallback } from "react";
import useSectionStore from "../store/section.store";
import { SectionState } from "../types/section.t";
import useEditorConfigStore from "../store/editorConfig.store";

const useEditor = () => {
  const [
    sections,
    updateSection,
    updateSelectedItem,
    updateSelectedSection,
    updateSelectedContainer,
  ] = useSectionStore((state) => [
    state.section,
    state.updateSection,
    state.updateSelectedItem,
    state.updateSelectedSection,
    state.updateSelectedContainer,
  ]);
  const [handleIsEditMode] = useEditorConfigStore((state) => [
    state.handleIsEditMode,
  ]);

  const clearEditor = useCallback(() => {
    handleIsEditMode(true);
    updateSection([]);
    updateSelectedItem(null);
    updateSelectedSection(null);
    updateSelectedContainer(null);
  }, [
    handleIsEditMode,
    updateSection,
    updateSelectedContainer,
    updateSelectedItem,
    updateSelectedSection,
  ]);

  const updateEditor = useCallback(
    (data: string) => {
      try {
        const updateData = JSON.parse(data) as SectionState[];
        if (updateData) {
          updateSection(updateData);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [updateSection]
  );

  const getEditorData = useCallback(() => {
    return sections;
  }, [sections]);

  const makeViewMode = useCallback(() => {
    handleIsEditMode(false);
  }, [handleIsEditMode]);

  return { clearEditor, updateEditor, getEditorData, makeViewMode };
};

export default useEditor;
