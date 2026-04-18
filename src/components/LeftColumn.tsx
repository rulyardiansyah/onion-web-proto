"use client";

import { ChevronRight } from "lucide-react";
import {
  useDesigner,
  SCREEN_OPTIONS,
} from "@/store/designer-store";

export default function LeftColumn() {
  const { state, dispatch } = useDesigner();

  const selectedScreen = SCREEN_OPTIONS.find(
    (s) => s.id === state.selectedScreenId
  );

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col shrink-0 overflow-y-auto">
      {/* Breadcrumb */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center text-sm text-text-secondary gap-1">
          <span>Aplikasi</span>
          <span>/</span>
          <span className="text-primary font-medium">Desain</span>
          <ChevronRight size={14} />
        </div>
        <h2 className="text-base font-semibold mt-1 flex items-center gap-2">
          <ChevronRight size={16} className="text-primary" />
          Pengaturan Desain
        </h2>
      </div>

      {/* Screen Selector */}
      <div className="px-4 py-3 border-t border-border">
        <label className="text-xs font-medium text-text-secondary block mb-1.5">
          Desain
        </label>
        <select
          value={state.selectedScreenId}
          onChange={(e) =>
            dispatch({ type: "SELECT_SCREEN", screenId: e.target.value })
          }
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer"
        >
          {SCREEN_OPTIONS.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Inputs */}
      <div className="px-4 py-3 border-t border-border flex-1">
        {state.selectedScreenId === "identity" && <IdentityInputs />}
        {state.selectedScreenId !== "identity" && selectedScreen && (
          <ScreenInfo screenLabel={selectedScreen.label} componentCount={selectedScreen.components.length} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 border-t border-border flex gap-2">
        <button className="px-4 py-2 text-sm rounded-full border border-primary text-primary hover:bg-primary-light transition-colors">
          Reset
        </button>
        <button className="px-4 py-2 text-sm rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
          Simpan
        </button>
      </div>
    </aside>
  );
}

function IdentityInputs() {
  const { state, dispatch } = useDesigner();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-text-secondary block mb-1.5">
          Nama Aplikasi
        </label>
        <input
          type="text"
          value={state.identityForm.appName}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_IDENTITY",
              field: "appName",
              value: e.target.value,
            })
          }
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary block mb-1.5">
          Nama Institusi
        </label>
        <input
          type="text"
          value={state.identityForm.institutionName}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_IDENTITY",
              field: "institutionName",
              value: e.target.value,
            })
          }
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary block mb-1.5">
          Ikon Aplikasi
        </label>
        <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-primary text-xs font-bold">O</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{state.identityForm.appIcon}</p>
            <p className="text-xs text-text-secondary">1.24 MB</p>
          </div>
          <button className="text-text-secondary hover:text-red-500 text-lg leading-none">
            &times;
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1.5">
          944px x 224px, transparan, rata kiri.
        </p>
      </div>
    </div>
  );
}

function ScreenInfo({ screenLabel, componentCount }: { screenLabel: string; componentCount: number }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Layar <span className="font-medium text-text-primary">{screenLabel}</span> memiliki{" "}
        <span className="font-medium text-text-primary">{componentCount}</span> komponen.
      </p>
      <p className="text-xs text-text-secondary">
        Atur tata letak komponen pada kanvas di tengah. Pilih komponen untuk mengedit propertinya di panel kanan.
      </p>
    </div>
  );
}
