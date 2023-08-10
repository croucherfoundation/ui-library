import { useCallback } from "react";
import useEditorConfigStore from "../store/editorConfig.store";
import useImageConfigStore from "../store/imageConfig.store";
import useSectionStore from "../store/section.store";
import { SectionState } from "../types/section.t";

interface updateEditorProps {
  en: string;
  hk: string;
}

const useEditor = () => {
  const [
    sections,
    updateAllSection,
    updateEnSection,
    updateHkSection,
    updateSelectedItem,
    updateSelectedSection,
    updateSelectedContainer,
  ] = useSectionStore((state) => [
    state.section,
    state.updateAllSection,
    state.updateEnSection,
    state.updateHkSection,
    state.updateSelectedItem,
    state.updateSelectedSection,
    state.updateSelectedContainer,
  ]);

  const [lan, handleIsEditMode, updateLanguage] = useEditorConfigStore(
    (state) => [state.lan, state.handleIsEditMode, state.updateLan]
  );

  const [updateImageLoading] = useImageConfigStore((state) => [
    state.updateImageLoading,
  ]);

  const clearEditor = useCallback(() => {
    handleIsEditMode(true);
    updateEnSection([]);
    updateHkSection([]);
    updateSelectedItem(null);
    updateSelectedSection(null);
    updateSelectedContainer(null);
  }, [
    handleIsEditMode,
    updateEnSection,
    updateHkSection,
    updateSelectedContainer,
    updateSelectedItem,
    updateSelectedSection,
  ]);

  const updateEditor = useCallback(
    ({ en, hk }: updateEditorProps) => {
      try {
        const enUpdateData = JSON.parse(en) as SectionState[];
        const hkUpdateData = JSON.parse(hk) as SectionState[];
        if (enUpdateData && hkUpdateData) {
          updateAllSection({ en: enUpdateData, hk: hkUpdateData });
        }
      } catch (e) {
        console.log(e);
      }
    },
    [updateAllSection]
  );

  const getEditorData = useCallback(() => {
    return sections;
  }, [sections]);

  const makeViewMode = useCallback(() => {
    handleIsEditMode(false);
  }, [handleIsEditMode]);
  const makeViewMode = useCallback(() => {
    handleIsEditMode(false);
  }, [handleIsEditMode]);

  return {
    lan,
    clearEditor,
    updateEditor,
    getEditorData,
    makeViewMode,
    updateImageLoading,
    updateLanguage,
  };
};

export default useEditor;
