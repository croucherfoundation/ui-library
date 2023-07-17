import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

const useContainer = ({ containerId, sectionId, elementId }: Props) => {
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);

  const initialConfig = {
    namespace: containerId,
    nodes: EDITOR_NODES,
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
      currentElement.content.body = JSON.stringify(editorState);

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
  };

  return {
    initialConfig,
    handleOnChange,
  };
};

export default useContainer;
