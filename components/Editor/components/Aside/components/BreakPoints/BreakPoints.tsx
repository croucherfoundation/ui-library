import { FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import { EditorTooltip } from "../../../EditorTooltip/EditorTooltip";
import useContainer from "./useContainer";

const BreakPoints = () => {
  const { breakpoint, setBreakpoint, defaultBreakPointStyle } = useContainer();

  return (
    <div className="p-3">
      <h3 className="mb-3 font-bold">Select breakpoints</h3>
      <div className="items-center mb-2 justify-start col-span-1 space-x-2 flex mt-2">
        <EditorTooltip
          renderOpener={(props) => (
            <div {...props}>
              <button
                onClick={() => setBreakpoint("sm")}
                className={`${defaultBreakPointStyle} ${
                  breakpoint === "sm" ? "bg-indigo-700 text-white" : "bg-white"
                }`}
              >
                <FiSmartphone />
              </button>
            </div>
          )}
        >
          <>
            <div className="text-xs">Mobiles</div>
          </>
        </EditorTooltip>

        <EditorTooltip
          renderOpener={(props) => (
            <div {...props}>
              <button
                onClick={() => setBreakpoint("md")}
                className={`${defaultBreakPointStyle} ${
                  breakpoint === "md" ? "bg-indigo-700 text-white" : "bg-white"
                }`}
              >
                <FiTablet />
              </button>
            </div>
          )}
        >
          <>
            <div className="text-xs">Tablets</div>
          </>
        </EditorTooltip>

        <EditorTooltip
          renderOpener={(props) => (
            <div {...props}>
              <button
                onClick={() => setBreakpoint("lg")}
                className={`${defaultBreakPointStyle} ${
                  breakpoint === "lg" ? "bg-indigo-700 text-white" : "bg-white"
                }`}
              >
                <FiMonitor />
              </button>
            </div>
          )}
        >
          <>
            <div className="text-xs">Desktops</div>
          </>
        </EditorTooltip>
      </div>
    </div>
  );
};

export default BreakPoints;
