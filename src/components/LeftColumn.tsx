"use client";

import { useRef } from "react";
import { ChevronRight, ImagePlus } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch({ type: "UPDATE_IDENTITY", field: "appIcon", value: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemove() {
    dispatch({ type: "UPDATE_IDENTITY", field: "appIcon", value: null });
  }

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
        <div className="icon-uploader">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button className="icon-uploader__drop" onClick={() => fileInputRef.current?.click()}>
            <div className="icon-uploader__preview">
              {state.identityForm.appIcon ? (
                <img src={state.identityForm.appIcon} alt="App icon" />
              ) : (
                <div className="icon-uploader__placeholder">
                  <ImagePlus size={20} />
                </div>
              )}
            </div>
            <div className="icon-uploader__meta">
              <p className="icon-uploader__filename">
                {state.identityForm.appIcon ? "Ikon terupload" : "Pilih gambar..."}
              </p>
              <p className="icon-uploader__instruction">512×512px, PNG/SVG transparan</p>
            </div>
          </button>
          {state.identityForm.appIcon && (
            <div className="icon-uploader__actions">
              <button className="icon-uploader__btn" onClick={() => fileInputRef.current?.click()}>
                Ganti
              </button>
              <button className="icon-uploader__btn icon-uploader__btn--remove" onClick={handleRemove}>
                Hapus
              </button>
            </div>
          )}
        </div>
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
