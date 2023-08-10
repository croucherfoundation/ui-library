import { useContainer } from "./useContainer";

function AsideTab() {
  const { isDisabledSetting, getStyle, setTab } = useContainer();

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px justify-around">
        <li className="flex-1">
          <button
            onClick={() => setTab("editor")}
            className={`w-full block text-xs p-4 ${getStyle("editor")}`}
          >
            Components
          </button>
        </li>
        <li className="flex-1">
          <button
            className={`w-full block text-xs p-4 rounded-t-lg active ${getStyle(
              "setting"
            )} ${isDisabledSetting ? "cursor-not-allowed" : ""}`}
            onClick={() => {
              if (isDisabledSetting) return;
              setTab("setting");
            }}
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
}
export default AsideTab;
