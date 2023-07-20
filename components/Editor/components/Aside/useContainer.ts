import useEditorConfigStore from "../../store/editorConfig.store";

const useContainer = () => {
  const [isEditMode] = useEditorConfigStore((state) => [state.isEditMode]);
  return {
    isEditMode,
  };
};

export default useContainer;
