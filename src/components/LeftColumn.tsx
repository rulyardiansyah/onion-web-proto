"use client";

import { ChevronRight } from "lucide-react";
import { useDesigner, SCREEN_OPTIONS } from "@/store/designer-store";

export default function LeftColumn() {
  const { state, dispatch } = useDesigner();
  const selectedScreen = SCREEN_OPTIONS.find((s) => s.id === state.selectedScreenId);

  return (
    <aside className="left-col">
      <div className="left-col__breadcrumb">
        <div className="left-col__breadcrumb-trail">
          <span>Aplikasi</span>
          <span>/</span>
          <span className="active">Desain</span>
          <ChevronRight size={14} />
        </div>
        <h2 className="left-col__title">
          <ChevronRight size={16} />
          Pengaturan Desain
        </h2>
      </div>

      <div className="left-col__section">
        <label className="left-col__label">Desain</label>
        <select
          className="left-col__select"
          value={state.selectedScreenId}
          onChange={(e) => dispatch({ type: "SELECT_SCREEN", screenId: e.target.value })}
        >
          {SCREEN_OPTIONS.map((screen) => (
            <option key={screen.id} value={screen.id}>{screen.label}</option>
          ))}
        </select>
      </div>

      <div className="left-col__section--grow">
        {state.selectedScreenId === "identity" && <IdentityInputs />}
        {state.selectedScreenId !== "identity" && selectedScreen && (
          <ScreenInfo screenLabel={selectedScreen.label} componentCount={selectedScreen.components.length} />
        )}
      </div>

      <div className="left-col__actions">
        <button className="btn-highlight">Reset</button>
        <button className="btn-cta">Simpan</button>
      </div>
    </aside>
  );
}

function IdentityInputs() {
  const { state, dispatch } = useDesigner();

  return (
    <div className="left-col__form">
      <div className="left-col__form-field">
        <label className="left-col__label">Nama Aplikasi</label>
        <input
          type="text"
          className="left-col__input"
          value={state.identityForm.appName}
          onChange={(e) => dispatch({ type: "UPDATE_IDENTITY", field: "appName", value: e.target.value })}
        />
      </div>
      <div className="left-col__form-field">
        <label className="left-col__label">Nama Institusi</label>
        <input
          type="text"
          className="left-col__input"
          value={state.identityForm.institutionName}
          onChange={(e) => dispatch({ type: "UPDATE_IDENTITY", field: "institutionName", value: e.target.value })}
        />
      </div>
      <div className="left-col__form-field">
        <label className="left-col__label">Ikon Aplikasi</label>
        <div className="left-col__file-preview">
          <div className="left-col__file-icon">O</div>
          <div className="left-col__file-info">
            <p className="left-col__file-name">{state.identityForm.appIcon}</p>
            <p className="left-col__file-size">1.24 MB</p>
          </div>
          <button className="left-col__file-remove">&times;</button>
        </div>
        <p className="left-col__hint">944px x 224px, transparan, rata kiri.</p>
      </div>
    </div>
  );
}

function ScreenInfo({ screenLabel, componentCount }: { screenLabel: string; componentCount: number }) {
  return (
    <div className="left-col__screen-info">
      <p>Layar <span>{screenLabel}</span> memiliki <span>{componentCount}</span> komponen.</p>
      <small>Atur tata letak komponen pada kanvas di tengah. Pilih komponen untuk mengedit propertinya di panel kanan.</small>
    </div>
  );
}
