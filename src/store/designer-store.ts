"use client";

import { createContext, useContext } from "react";

export type ComponentType =
  | "header"
  | "banner"
  | "quick-menu"
  | "balance-card"
  | "promo-carousel"
  | "transaction-list"
  | "notification-bar"
  | "footer-nav";

export interface ComponentProperty {
  key: string;
  label: string;
  type: "text" | "color" | "number" | "select" | "toggle";
  value: string | number | boolean;
  options?: string[];
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  label: string;
  properties: ComponentProperty[];
}

export interface ScreenConfig {
  id: string;
  label: string;
  components: CanvasComponent[];
}

export const SCREEN_OPTIONS: ScreenConfig[] = [
  {
    id: "identity",
    label: "Identitas Aplikasi",
    components: [],
  },
  {
    id: "splash-screen",
    label: "Splash Screen",
    components: [
      {
        id: "banner-s",
        type: "banner",
        label: "Logo Banner",
        properties: [
          { key: "bgColor", label: "Warna Latar", type: "color", value: "#00bcd4" },
          { key: "logoSize", label: "Ukuran Logo", type: "number", value: 120 },
        ],
      },
    ],
  },
  {
    id: "sign-in",
    label: "Sign In",
    components: [
      {
        id: "header-si",
        type: "header",
        label: "Header Sign In",
        properties: [
          { key: "title", label: "Judul", type: "text", value: "Masuk" },
          { key: "bgColor", label: "Warna Latar", type: "color", value: "#00bcd4" },
          { key: "textColor", label: "Warna Teks", type: "color", value: "#ffffff" },
        ],
      },
      {
        id: "banner-si",
        type: "banner",
        label: "Banner",
        properties: [
          { key: "bgColor", label: "Warna Latar", type: "color", value: "#e0f7fa" },
          { key: "logoSize", label: "Ukuran Logo", type: "number", value: 80 },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Home",
    components: [
      {
        id: "header-1",
        type: "header",
        label: "Header",
        properties: [
          { key: "title", label: "Judul", type: "text", value: "ONION" },
          { key: "bgColor", label: "Warna Latar", type: "color", value: "#00bcd4" },
          { key: "textColor", label: "Warna Teks", type: "color", value: "#ffffff" },
        ],
      },
      {
        id: "balance-1",
        type: "balance-card",
        label: "Kartu Saldo",
        properties: [
          { key: "showBalance", label: "Tampilkan Saldo", type: "toggle", value: true },
          { key: "bgColor", label: "Warna Latar", type: "color", value: "#ffffff" },
          { key: "currency", label: "Mata Uang", type: "select", value: "IDR", options: ["IDR", "USD", "EUR"] },
        ],
      },
      {
        id: "quick-menu-1",
        type: "quick-menu",
        label: "Menu Cepat",
        properties: [
          { key: "columns", label: "Jumlah Kolom", type: "number", value: 4 },
          { key: "iconColor", label: "Warna Ikon", type: "color", value: "#00bcd4" },
        ],
      },
      {
        id: "promo-1",
        type: "promo-carousel",
        label: "Promo Carousel",
        properties: [
          { key: "autoPlay", label: "Putar Otomatis", type: "toggle", value: true },
          { key: "interval", label: "Interval (detik)", type: "number", value: 5 },
        ],
      },
      {
        id: "transaction-1",
        type: "transaction-list",
        label: "Riwayat Transaksi",
        properties: [
          { key: "maxItems", label: "Maks. Item", type: "number", value: 5 },
          { key: "showDate", label: "Tampilkan Tanggal", type: "toggle", value: true },
        ],
      },
    ],
  },
];

export interface IdentityFormData {
  appName: string;
  institutionName: string;
  appIcon: string | null;
}

export interface DesignerState {
  selectedScreenId: string;
  canvasComponents: CanvasComponent[];
  selectedComponentId: string | null;
  identityForm: IdentityFormData;
  rightTab: "properties" | "layers";
}

export const initialState: DesignerState = {
  selectedScreenId: "identity",
  canvasComponents: [],
  selectedComponentId: null,
  identityForm: {
    appName: "ONION",
    institutionName: "DAKSA Indonesia",
    appIcon: null,
  },
  rightTab: "properties",
};

export type DesignerAction =
  | { type: "SELECT_SCREEN"; screenId: string }
  | { type: "SELECT_COMPONENT"; componentId: string | null }
  | { type: "SET_RIGHT_TAB"; tab: "properties" | "layers" }
  | { type: "REORDER_COMPONENTS"; components: CanvasComponent[] }
  | {
      type: "UPDATE_PROPERTY";
      componentId: string;
      propertyKey: string;
      value: string | number | boolean;
    }
  | {
      type: "UPDATE_IDENTITY";
      field: keyof IdentityFormData;
      value: string | null;
    };

export function designerReducer(
  state: DesignerState,
  action: DesignerAction
): DesignerState {
  switch (action.type) {
    case "SELECT_SCREEN": {
      const screen = SCREEN_OPTIONS.find((s) => s.id === action.screenId);
      return {
        ...state,
        selectedScreenId: action.screenId,
        canvasComponents: screen
          ? screen.components.map((c) => ({ ...c, properties: [...c.properties.map(p => ({...p}))] }))
          : [],
        selectedComponentId: null,
      };
    }
    case "SELECT_COMPONENT":
      return { ...state, selectedComponentId: action.componentId };
    case "SET_RIGHT_TAB":
      return { ...state, rightTab: action.tab };
    case "REORDER_COMPONENTS":
      return { ...state, canvasComponents: action.components };
    case "UPDATE_PROPERTY":
      return {
        ...state,
        canvasComponents: state.canvasComponents.map((comp) =>
          comp.id === action.componentId
            ? {
                ...comp,
                properties: comp.properties.map((prop) =>
                  prop.key === action.propertyKey
                    ? { ...prop, value: action.value }
                    : prop
                ),
              }
            : comp
        ),
      };
    case "UPDATE_IDENTITY":
      return {
        ...state,
        identityForm: { ...state.identityForm, [action.field]: action.value },
      };
    default:
      return state;
  }
}

export const DesignerContext = createContext<{
  state: DesignerState;
  dispatch: React.Dispatch<DesignerAction>;
} | null>(null);

export function useDesigner() {
  const ctx = useContext(DesignerContext);
  if (!ctx) throw new Error("useDesigner must be used within DesignerProvider");
  return ctx;
}
