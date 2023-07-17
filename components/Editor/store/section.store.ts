import { create } from "zustand";
import {
  SelectedEditorItem,
  type Section,
  type SectionState,
} from "../types/section.t";

const useSectionStore = create<Section>()((set) => ({
  section: [],
  previewMode: false,
  selectedItem: null,
  updateSection: (payload: SectionState[]) =>
    set({
      section: payload,
    }),
  updateSelectedItem: (payload: SelectedEditorItem | null) =>
    set({
      selectedItem: payload,
    }),
}));

export default useSectionStore;
