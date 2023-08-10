import { useMemo } from "react";
import useEditorConfigStore from "../../store/editorConfig.store";

const useContainer = () => {
     const [isEditMode, previewMode, currentTab, lan, updateLan] =
          useEditorConfigStore((state) => [
               state.isEditMode,
               state.config.previewMode,
               state.currentTab,
               state.lan,
               state.updateLan,
          ]);

     const isSettingTab = useMemo(() => currentTab === "setting", [currentTab]);
     const isEditorTab = useMemo(() => currentTab === "editor", [currentTab]);

     return {
          isEditMode,
          previewMode,
          isSettingTab,
          isEditorTab,
          lan,
          updateLan,
     };
};

export default useContainer;
