import useSectionStore from "../../../../store/section.store";

const useContainer = () => {
  const [breakpoint, setBreakpoint] = useSectionStore((state) => [
    state.breakpoint,
    state.setBreakpoint,
    state.selectedItem,
  ]);

  const defaultBreakPointStyle =
    "flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-700 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 bg-gray-800 focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-500 border hover:border-indigo-500";

  return {
    breakpoint,
    setBreakpoint,
    defaultBreakPointStyle,
  };
};

export default useContainer;
