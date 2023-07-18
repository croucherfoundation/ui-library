import { create } from "zustand";
import { SelectedEditorItem, Section, SectionState } from "../types/section.t";
import { persist } from "zustand/middleware";

const useSectionStore = create<Section>()(
  persist(
    (set) => ({
      section: [],
      selectedItem: null,
      updateSection: (payload: SectionState[]) =>
        set({
          section: payload,
        }),
      updateSelectedItem: (payload: SelectedEditorItem | null) =>
        set({
          selectedItem: payload,
        }),
    }),
    {
      name: "sections",
      getStorage: () => localStorage,
    }
  )
);

export default useSectionStore;
