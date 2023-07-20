import { useCallback } from "react";
import useSectionStore from "../store/section.store";
import { SectionState } from "../types/section.t";
import useEditorConfigStore from "../store/editorConfig.store";

const useEditor = () => {
  const [sections, updateSection, updateSelectedItem] = useSectionStore(
    (state) => [state.section, state.updateSection, state.updateSelectedItem]
  );
  const [handleIsEditMode] = useEditorConfigStore((state) => [
    state.handleIsEditMode,
  ]);

  const clearEditor = useCallback(() => {
    handleIsEditMode(true);
    updateSection([]);
    updateSelectedItem(null);
  }, [handleIsEditMode, updateSection, updateSelectedItem]);

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

  const makeViewMode = useCallback(
    () => {
      handleIsEditMode(false);
    },
    [handleIsEditMode]
  );

  return { clearEditor, updateEditor, getEditorData, makeViewMode };
};

export default useEditor;
