"use client";

import { useReducer } from "react";
import {
  DesignerContext,
  designerReducer,
  initialState,
} from "@/store/designer-store";

export default function DesignerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(designerReducer, initialState);
  return (
    <DesignerContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignerContext.Provider>
  );
}
