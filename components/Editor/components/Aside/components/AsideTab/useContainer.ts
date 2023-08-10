import { useCallback, useEffect, useMemo } from "react";
import useEditorConfigStore from "../../../../store/editorConfig.store";
import { TabbarNameTypes } from "../../../../types/editorConfig.t";
import useSectionStore from "../../../../store/section.store";

export function useContainer() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  const [currentTab, handleTabName] = useEditorConfigStore((store) => [
    store.currentTab,
    store.handleTabName,
  ]);

  const noActiveStyle =
    "border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300";
  const activeStyle = "text-blue-600 border-b-2 border-blue-600";

  const getStyle = useCallback(
    (tabName: string): string => {
      return tabName === currentTab ? activeStyle : noActiveStyle;
    },
    [currentTab]
  );

  const setTab = useCallback(
    (value: TabbarNameTypes) => {
      handleTabName(value);
    },
    [handleTabName]
  );

  const isDisabledSetting = useMemo(() => {
    return !selectedItem;
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem && currentTab !== "editor") {
      handleTabName("editor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, selectedItem]);

  return {
    getStyle,
    setTab,
    isDisabledSetting,
  };
}
