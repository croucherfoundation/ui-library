import React from "react";

import Col12 from "../Icons/Col12";
import Col3_3_3_3 from "../Icons/Col3_3_3_3";
import Col3_3_6 from "../Icons/Col3_3_6";
import Col4_4_4 from "../Icons/Col4_4_4";
import Col6_6 from "../Icons/Col6_6";

import SocketBlock from "../SocketBlock/SocketBlock";

import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import useContainer from "../../useContainer";
import SelectedSectionIcon from "../Aside/components/SelectedSectionIcon";

const Section = () => {
  const { handleCreateSection, sections, getGenerateGridCol } = useContainer();
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);

  return (
    <section className="w-full overflow-y-auto">
      {/* ----- main play ground ----- */}
      <div className="">
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            {!editorConfig.previewMode && (
              <SelectedSectionIcon
                id={section.id}
                layoutStyle={section.layoutStyle}
                isSelected={section.id === selectedItem?.id}
              />
            )}
            <div
              style={{
                minHeight: section.option.minHeight,
                backgroundColor: section.style.background.normal.bgColor,
              }}
              // gap-${section.option.gap}
              className={`grid grid-cols-12 my-2.5 relative ${
                section.id === selectedItem?.id && !editorConfig.previewMode
                  ? "border-2 border-indigo-400 border-dashed"
                  : ""
              }`}
            >
              {section.children.map((container, index) => (
                <React.Fragment key={container.id}>
                  <SocketBlock
                    style={{
                      backgroundColor:
                        container.style.background.normal.bgColor,
                      width: container.option.contentWidth,
                    }}
                    sectionId={section.id}
                    containerId={container.id}
                    container={container}
                    gridColClass={getGenerateGridCol(
                      section.layoutStyle,
                      index
                    )}
                  />
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ----- add new layout button ----- */}
      {!editorConfig.previewMode && (
        <div className="py-5">
          <h3 className="text-center text-xl mb-5">Select your structure</h3>
          <div className="w-8/12 mx-auto bg-slate-100 py-6 px-5 rounded-md">
            <div className="grid grid-cols-4 gap-5 mt-5">
              <button
                onClick={() => handleCreateSection("_12")}
                className="rounded flex justify-center"
              >
                <Col12 />
              </button>
              <button
                onClick={() => handleCreateSection("_6_6")}
                className="rounded flex justify-center"
              >
                <Col6_6 />
              </button>
              <button
                onClick={() => handleCreateSection("_4_4_4")}
                className="rounded flex justify-center"
              >
                <Col4_4_4 />
              </button>
              <button
                onClick={() => handleCreateSection("_3_3_6")}
                className="rounded flex justify-center"
              >
                <Col3_3_6 />
              </button>
              <button
                onClick={() => handleCreateSection("_3_3_3_3")}
                className="rounded flex justify-center"
              >
                <Col3_3_3_3 />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Section;
