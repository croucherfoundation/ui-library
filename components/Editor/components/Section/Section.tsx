import React from "react";

import Col12 from "../Icons/Col12";
import Col3_3_3_3 from "../Icons/Col3_3_3_3";
import Col3_3_6 from "../Icons/Col3_3_6";
import Col4_4_4 from "../Icons/Col4_4_4";
import Col6_6 from "../Icons/Col6_6";
import { StyledSection } from "./Section.style";
import { StyledSectionWrapper } from "./SectionWrapper.style";

import SocketBlock from "../SocketBlock/SocketBlock";

import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import SelectedSectionIcon from "../Aside/components/SelectedSectionIcon/SelectedSectionIcon";
import If from "../If";
import IfElse from "../IfElse";
import useContainer from "./useContainer";

const Section = () => {
  const {
    lan,
    sections,
    handleCreateSection,
    isEditMode,
    previewMode,
    getGenerateGridCol,
  } = useContainer();
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);

  return (
    <section className="w-full overflow-y-auto ">
      {/* ----- main play ground ----- */}
      <div className="">
        <IfElse
          isTrue={lan === "en"}
          ifBlock={
            <>
              {sections["en"].map((section) => (
                <div key={section.id} className="group/section">
                  <If isTrue={isEditMode}>
                    <If isTrue={!editorConfig.previewMode}>
                      <div
                        className={
                          section.id === selectedItem?.id
                            ? ""
                            : "group-hover/section:opacity-100 opacity-0"
                        }
                      >
                        <SelectedSectionIcon
                          id={section.id}
                          layoutStyle={section.layoutStyle}
                          isSelected={section.id === selectedItem?.id}
                          section={section}
                        />
                      </div>
                    </If>
                  </If>

                  <StyledSectionWrapper
                    style={section.style}
                    className={` ${
                      isEditMode
                        ? previewMode
                          ? ""
                          : `border-y border-dashed  ${
                              section.id === selectedItem?.id
                                ? "border-indigo-500"
                                : "border-transparent group-hover/section:border-indigo-300 " +
                                  (section?.style?.background?.normal?.bgColor
                                    ? ""
                                    : "group-hover/section:bg-[#fafafa]")
                            } rounded-[5px]  `
                        : ""
                    }`}
                  >
                    <StyledSection
                      className={`grid grid-cols-12 relative gap-${section.option.gap}`}
                      style={{
                        overflow: "visible",
                      }}
                      option={section.option}
                    >
                      {/* ----- containers aka socketblocks ----- */}
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
                    </StyledSection>
                  </StyledSectionWrapper>
                </div>
              ))}
            </>
          }
          elseBlock={
            <>
              {sections["hk"].map((section) => (
                <div key={section.id} className="group/section">
                  <If isTrue={isEditMode}>
                    <If isTrue={!editorConfig.previewMode}>
                      <div
                        className={
                          section.id === selectedItem?.id
                            ? ""
                            : "group-hover/section:opacity-100 opacity-0"
                        }
                      >
                        <SelectedSectionIcon
                          id={section.id}
                          layoutStyle={section.layoutStyle}
                          isSelected={section.id === selectedItem?.id}
                          section={section}
                        />
                      </div>
                    </If>
                  </If>
                  {/* <div
className={`
bg-[${section.style.background.normal.bgColor}]
sm:p-t-[${section.style.padding.sm.paddingTop}px]
sm:p-r-[${section.style.padding.sm.paddingRight}px]
sm:p-b-[${section.style.padding.sm.paddingBottom}px]
sm:p-l-[${section.style.padding.sm.paddingLeft}px]
md:p-t-[${section.style.padding.md.paddingTop}px]
md:p-r-[${section.style.padding.md.paddingRight}px]
md:p-b-[${section.style.padding.md.paddingBottom}px]
md:p-l-[${section.style.padding.md.paddingLeft}px]
lg:p-t-[${section.style.padding.lg.paddingTop}px]
lg:p-r-[${section.style.padding.lg.paddingRight}px]
lg:p-b-[${section.style.padding.lg.paddingBottom}px]
lg:p-l-[${section.style.padding.lg.paddingLeft}px]
`}
style={{
minHeight: section.option.minHeight,
backgroundColor: section.style.background.normal.bgColor,
paddingTop: `${section.style.padding.lg.paddingTop}px`,
paddingLeft: `${section.style.padding.lg.paddingLeft}px`,
paddingBottom: `${section.style.padding.lg.paddingBottom}px`,
paddingRight: `${section.style.padding.lg.paddingRight}px`,
}}
className={`grid grid-cols-12 relative gap-${
section.option.gap
} ${
section.id === selectedItem?.id && !editorConfig.previewMode
? "border-2 border-indigo-400 border-dashed"
: ""
}`}
>
</div> */}
                  <StyledSectionWrapper
                    style={section.style}
                    className={` ${
                      isEditMode
                        ? previewMode
                          ? ""
                          : `border-y border-dashed  ${
                              section.id === selectedItem?.id
                                ? "border-indigo-500"
                                : "border-transparent group-hover/section:border-indigo-300 " +
                                  (section?.style?.background?.normal?.bgColor
                                    ? ""
                                    : "group-hover/section:bg-[#fafafa]")
                            } rounded-[5px]  `
                        : ""
                    }`}
                  >
                    <StyledSection
                      className={`grid grid-cols-12 relative gap-${section.option.gap}`}
                      style={{
                        overflow: "visible",
                      }}
                      option={section.option}
                    >
                      {/* ----- containers aka socketblocks ----- */}
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
                    </StyledSection>
                  </StyledSectionWrapper>
                </div>
              ))}
            </>
          }
        />
      </div>

      {/* ----- add new layout button ----- */}
      <If isTrue={isEditMode}>
        <If isTrue={!editorConfig.previewMode}>
          <div className="py-10 w-full bg-[#f3f3ef] md:ma-w-[358px] lg:max-w-[1218px] mx-auto my-20">
            <h3 className="mb-5 text-xl font-bold text-center">
              Select your structure
            </h3>
            <div className="flex flex-wrap justify-center gap-5">
              <button
                onClick={() => handleCreateSection("_12")}
                className="flex justify-center ease-in duration-30 transition-all p-2 rounded-[5px]"
              >
                <Col12 className="hover:fill-edt-dark/30 fill-edt-dark/10" />
              </button>
              <button
                onClick={() => handleCreateSection("_6_6")}
                className="ease-in duration-30 transition-all p-2 rounded-[5px]"
              >
                <Col6_6 className="hover:fill-edt-dark/30 fill-edt-dark/10" />
              </button>
              <button
                onClick={() => handleCreateSection("_4_4_4")}
                className="ease-in duration-30 transition-all p-2 rounded-[5px]"
              >
                <Col4_4_4 className="hover:fill-edt-dark/30 fill-edt-dark/10" />
              </button>
              <button
                onClick={() => handleCreateSection("_3_3_6")}
                className="ease-in duration-30 transition-all p-2 rounded-[5px]"
              >
                <Col3_3_6 className="hover:fill-edt-dark/30 fill-edt-dark/10" />
              </button>
              <button
                onClick={() => handleCreateSection("_3_3_3_3")}
                className="ease-in duration-30 transition-all p-2 rounded-[5px]"
              >
                <Col3_3_3_3 className="hover:fill-edt-dark/30 fill-edt-dark/10" />
              </button>
            </div>
          </div>
        </If>
      </If>
    </section>
  );
};
export default Section;
