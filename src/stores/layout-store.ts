import { ReactNode } from "react";
import { create } from "zustand";

type LayoutState = { leftContent: ReactNode; rightContent: ReactNode };
type LayoutAction = { updateLeftContent: (node: ReactNode) => void; updateRightContent: (node: ReactNode) => void };
type LayoutStore = LayoutState & LayoutAction;

export const useLayoutStore = create<LayoutStore>((set) => ({
  leftContent: null,
  rightContent: null,
  updateLeftContent: (node) => set({ leftContent: node }),
  updateRightContent: (node) => set({ rightContent: node }),
}));
