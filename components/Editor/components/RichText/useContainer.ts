import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";
import useEditorConfigStore from "../../store/editorConfig.store";
import { useMemo } from "react";

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

const useContainer = ({
  containerId,
  sectionId,
  elementId,
  bodyKey,
}: Props) => {
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);
  const [previewMode, isEditMode] = useEditorConfigStore((state) => [
    state.config.previewMode,
    state.isEditMode,
  ]);

  const handleOnChange = (editorState: unknown) => {
    const clonedSections = cloneDeep(sections);
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

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
  };

  const initialConfig = useMemo(() => {
    const clonedSections = cloneDeep(sections);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    const initialEditorState = {
      namespace: containerId,
      nodes: EDITOR_NODES,
      editorState:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      theme: {
        root: "focus:outline-none focus-visible:border-black p-3",
        link: "cursor-pointer",
        text: {
          bold: "font-semibold",
          underline: "underline",
          italic: "italic",
          strikethrough: "line-through",
          underlineStrikethrough: "underlined-line-through",
        },
        list: {
          listitem: "PlaygroundEditorTheme__listItem",
          listitemChecked: "PlaygroundEditorTheme__listItemChecked",
          listitemUnchecked: "PlaygroundEditorTheme__listItemUnchecked",
          nested: {
            listitem: "PlaygroundEditorTheme__nestedListItem",
          },
          olDepth: [
            "PlaygroundEditorTheme__ol1",
            "PlaygroundEditorTheme__ol2",
            "PlaygroundEditorTheme__ol3",
            "PlaygroundEditorTheme__ol4",
            "PlaygroundEditorTheme__ol5",
          ],
          ul: "PlaygroundEditorTheme__ul",
        },
        heading: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
        },
      },
      onError: (error: unknown) => {
        console.log(error);
      },
    };

    if (currentElement?.content.body[bodyKey]) {
      // console.log(currentElement?.content.body[bodyKey]);
      const value = currentElement?.content.body[bodyKey];
      if (value) {
        initialEditorState.editorState = value;
      }
    }

    return initialEditorState;
  }, [sectionId, bodyKey, containerId, elementId, sections]);

  return {
    initialConfig,
    handleOnChange,
    previewMode,
    isEditMode,
  };
};

export default useContainer;
