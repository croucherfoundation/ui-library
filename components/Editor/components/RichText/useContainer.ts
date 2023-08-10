import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useMemo } from "react";
import { sectionValueUpdater } from "../../helpers";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
  bodyKey: "body1" | "body2" | "body3";
}

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

const DEFAULT_EDITOR_TEXT = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

const useContainer = ({
  containerId,
  sectionId,
  elementId,
  bodyKey,
}: Props) => {
  const [sections, updateEnSection, updateHkSection] = useSectionStore(
    (state) => [state.section, state.updateEnSection, state.updateHkSection]
  );
  const [lan, previewMode, isEditMode] = useEditorConfigStore((state) => [
    state.lan,
    state.config.previewMode,
    state.isEditMode,
  ]);

  const handleOnChange = (editorState: unknown) => {
    if (lan === "en") {
      const clonedSections = cloneDeep(sections["en"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentElementIdx,
        currentSection,
        currentContainer,
        currentElement,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      if (currentElement !== null)
        currentElement.content.body[bodyKey] = JSON.stringify(editorState);

      fill(
        currentContainer.children,
        currentElement,
        currentElementIdx ?? 0,
        1
      );
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateEnSection(clonedSections);
      return;
    } else if (lan === "hk") {
      const clonedSections = cloneDeep(sections["hk"]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentElementIdx,
        currentSection,
        currentContainer,
        currentElement,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      if (currentElement !== null)
        currentElement.content.body[bodyKey] = JSON.stringify(editorState);

      fill(
        currentContainer.children,
        currentElement,
        currentElementIdx ?? 0,
        1
      );
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      updateHkSection(clonedSections);
      return;
    }
  };

  const initialConfig = useMemo(() => {
    const clonedSections = cloneDeep(sections[lan]);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    const initialEditorState = {
      namespace: containerId,
      nodes: [...EDITOR_NODES],
      editorState: DEFAULT_EDITOR_TEXT,
      theme: {
        root: "focus:outline-none focus-visible:border-black",
        link: "cursor-pointer",
        text: {
          bold: "font-semibold",
          underline: "underline",
          italic: "italic",
          strikethrough: "line-through",
          underlineStrikethrough: "underlined-line-through",
        },
        list: {
          listitem: "listItem",
          listitemChecked: "listItemChecked",
          listitemUnchecked: "listItemUnchecked",
          nested: {
            listitem: "nestedListItem",
          },
          olDepth: ["ol1", "ol2", "ol3", "ol4", "ol5"],
          ul: "ul",
        },
        heading: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
        },
        paragraph: "paragraph",
      },
      onError: (error: unknown) => {
        console.log(error);
      },
    };

    if (currentElement?.content.body[bodyKey]) {
      const value = currentElement?.content.body[bodyKey];
      if (value) {
        initialEditorState.editorState = value;
      }
    }

    return initialEditorState;
  }, [sectionId, bodyKey, containerId, elementId, sections, lan]);

  return {
    initialConfig,
    handleOnChange,
    previewMode,
    isEditMode,
  };
};

export default useContainer;
