import { create } from "zustand";
import {
  type SelectedEditorItem,
  type Section,
  type SectionState,
  type Breakpoint,
} from "../types/section.t";
import { persist } from "zustand/middleware";

const useSectionStore = create<Section & SectionActions>()(
  persist(
    (set) => ({
      section: [],
      selectedItem: null,
      selectedSection: null,
      breakpoint: "lg",
      updateSection: (payload: SectionState[]) =>
        set({
          section: payload,
        }),
      updateSelectedItem: (payload: SelectedEditorItem | null) =>
        set({
          selectedItem: payload,
        }),
      updateSelectedSection: (payload: SectionState | null) =>
        set({
          selectedSection: payload,
        }),
      setBreakpoint: (payload: Breakpoint) =>
        set({
          breakpoint: payload,
        }),
    }),
    {
      name: "sections",
      getStorage: () => localStorage,
    }
  )
);

export default useSectionStore;
