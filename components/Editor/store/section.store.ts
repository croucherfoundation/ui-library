import { create } from "zustand";
import {
  type SelectedEditorItem,
  type Section,
  type SectionState,
  type Breakpoint,
} from "../types/section.t";
import { persist } from "zustand/middleware";
import { Container } from "../types/container.t";

const useSectionStore = create<Section>()(
  persist(
    (set) => ({
      section: [],
      selectedItem: null,
      selectedSection: null,
      selectedContainer: null,
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
      updateSelectedContainer: (payload: Container | null) =>
        set({
          selectedContainer: payload,
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
