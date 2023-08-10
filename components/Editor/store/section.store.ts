import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Container } from "../types/container.t";
import { type Element } from "../types/element.t";
import {
  type Breakpoint,
  type Section,
  type SectionState,
  type SelectedEditorItem,
} from "../types/section.t";

export const IDBStorage = {
  getItem: async (name: string) => {
    // Exit early on server
    if (typeof indexedDB === "undefined") {
      return null;
    }
    const data = await get<string>(name);
    return data || null;
  },
  setItem: async (name: string, value: unknown) => {
    // Exit early on server
    if (typeof indexedDB === "undefined") {
      return;
    }
    await set(name, value);
  },
  removeItem: async (name: string) => {
    // Exit early on server
    if (typeof indexedDB === "undefined") {
      return;
    }
    await del(name);
  },
};

const useSectionStore = create<Section>()(
  persist(
    (set) => ({
      section: {
        en: [],
        hk: [],
      },
      selectedItem: null,
      selectedSection: null,
      selectedContainer: null,
      breakpoint: "lg",
      selectedElement: null,
      updateAllSection: (payload) => set(() => ({ section: payload })),
      updateEnSection: (payload: SectionState[]) =>
        set((state) => ({
          section: {
            en: payload,
            hk: state.section.hk,
          },
        })),
      updateHkSection: (payload: SectionState[]) =>
        set((state) => ({
          section: {
            en: state.section.en,
            hk: payload,
          },
        })),
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
      updateSelectedElement: (payload: Element | null) =>
        set({
          selectedElement: payload,
        }),
    }),
    {
      name: "sections",
      storage: createJSONStorage(() => IDBStorage),
      // getStorage: () => AsyncStorage,
      // onRehydrateStorage: (state) => {
      //   console.log("hydration state");
      // },
    }
  )
);

export default useSectionStore;
