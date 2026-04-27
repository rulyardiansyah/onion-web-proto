"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Smartphone } from "lucide-react";
import { useDesigner, type CanvasComponent } from "@/store/designer-store";

const bgColors: Record<string, string> = {
  header: "#00bcd4",
  banner: "#00bcd4",
  "balance-card": "#ffffff",
  "quick-menu": "#f0f9ff",
  "promo-carousel": "#fef3c7",
  "transaction-list": "#f0fdf4",
  "notification-bar": "#fef2f2",
  "footer-nav": "#f8fafc",
};

function ComponentBlock({ component }: { component: CanvasComponent }) {
  const { state, dispatch } = useDesigner();
  const isSelected = state.selectedComponentId === component.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.id });

  const dragStyle = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      onClick={() => dispatch({ type: "SELECT_COMPONENT", componentId: component.id })}
      className={`comp-block${isSelected ? " comp-block--selected" : ""}`}
    >
      <div className="comp-block__inner" style={{ backgroundColor: bgColors[component.type] || "#f8fafc" }}>
        <button {...attributes} {...listeners} className="comp-block__drag-handle">
          <GripVertical size={14} />
        </button>
        <ComponentPreview component={component} />
      </div>
    </div>
  );
}

function ComponentPreview({ component }: { component: CanvasComponent }) {
  switch (component.type) {
    case "header":
      return (
        <div className="comp-preview comp-preview--header">
          <span>{component.properties.find((p) => p.key === "title")?.value as string}</span>
          <div className="comp-preview--header__dots">
            <div className="comp-preview--header__dot" />
            <div className="comp-preview--header__dot" />
          </div>
        </div>
      );
    case "banner":
      return (
        <div
          className="comp-preview comp-preview--banner"
          style={{ backgroundColor: component.properties.find((p) => p.key === "bgColor")?.value as string }}
        >
          <div className="comp-preview--banner__icon">O</div>
        </div>
      );
    case "balance-card":
      return (
        <div className="comp-preview comp-preview--balance">
          <p className="comp-preview--balance__label">Saldo Anda</p>
          <p className="comp-preview--balance__amount">Rp 12.500.000</p>
        </div>
      );
    case "quick-menu":
      return (
        <div className="comp-preview comp-preview--quickmenu">
          {["Transfer", "Bayar", "Beli", "Lainnya"].map((item) => (
            <div key={item} className="comp-preview--quickmenu__item">
              <div className="comp-preview--quickmenu__dot" />
              <span className="comp-preview--quickmenu__label">{item}</span>
            </div>
          ))}
        </div>
      );
    case "promo-carousel":
      return (
        <div className="comp-preview comp-preview--promo">
          <div className="comp-preview--promo__card" style={{ background: "rgba(252,174,64,0.5)" }} />
          <div className="comp-preview--promo__card" style={{ background: "rgba(252,174,64,0.3)" }} />
        </div>
      );
    case "transaction-list":
      return (
        <div className="comp-preview comp-preview--txn">
          {[1, 2].map((i) => (
            <div key={i} className="comp-preview--txn__row">
              <div className="comp-preview--txn__left">
                <div className="comp-preview--txn__dot" />
                <span className="comp-preview--txn__name">Transaksi {i}</span>
              </div>
              <span className="comp-preview--txn__amount">-Rp 50.000</span>
            </div>
          ))}
        </div>
      );
    case "notification-bar":
      return (
        <div className="comp-preview comp-preview--notif">
          {[1, 2].map((i) => (
            <div key={i} className="comp-preview--notif__row">
              <div className="comp-preview--notif__dot" />
              <span className="comp-preview--notif__label">Notifikasi {i}</span>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="comp-preview comp-preview--default">{component.label}</div>
      );
  }
}

export default function CenterColumn() {
  const { state, dispatch } = useDesigner();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.canvasComponents.findIndex((c) => c.id === active.id);
      const newIndex = state.canvasComponents.findIndex((c) => c.id === over.id);
      dispatch({ type: "REORDER_COMPONENTS", components: arrayMove(state.canvasComponents, oldIndex, newIndex) });
    }
  }

  return (
    <div className="center-col">
      {state.selectedScreenId === "identity" ? (
        <IdentityPreview />
      ) : (
        <div className="phone-frame-wrapper">
          <div className="phone-frame">
            <div className="phone-statusbar">
              <span>23:48</span>
              <div className="phone-statusbar__notch" />
              <div className="phone-statusbar__indicators">
                <div className="phone-statusbar__bar" />
                <div className="phone-statusbar__bar" />
                <div className="phone-statusbar__bar" />
              </div>
            </div>
            <div className="phone-canvas">
              {state.canvasComponents.length === 0 ? (
                <div className="phone-canvas--empty">
                  <Smartphone size={48} />
                  <p>Tidak ada komponen</p>
                  <small>Pilih layar untuk mulai mendesain</small>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={state.canvasComponents.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="phone-canvas__list">
                      {state.canvasComponents.map((comp) => (
                        <ComponentBlock key={comp.id} component={comp} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
            <div className="phone-home-indicator">
              <div className="phone-home-indicator__bar" />
            </div>
          </div>
          <span className="platform-badge platform-badge--ios">iOS</span>
        </div>
      )}
    </div>
  );
}

function IdentityPreview() {
  const { state } = useDesigner();
  const initials = state.identityForm.appName.slice(0, 2).toUpperCase();

  return (
    <div className="identity-preview">
      {/* iOS Phone */}
      <div className="phone-frame-wrapper">
        <div className="phone-frame identity-preview__phone-ios-bg">
          <div className="phone-statusbar">
            <span>23:48</span>
            <div className="phone-statusbar__notch" />
            <div className="phone-statusbar__indicators">
              <div className="phone-statusbar__bar" />
              <div className="phone-statusbar__bar" />
            </div>
          </div>
          <div className="phone-apps">
            {["Calendar", "Photos", "Camera", "Mail"].map((app) => (
              <div key={app} className="phone-app">
                <div className="phone-app__icon" />
                <span className="phone-app__label">{app}</span>
              </div>
            ))}
            <div className="phone-app">
              <div className="phone-app__icon phone-app__icon--brand">
                {state.identityForm.appIcon
                  ? <img src={state.identityForm.appIcon} alt="App icon" />
                  : initials}
              </div>
              <span className="phone-app__label">{state.identityForm.appName}</span>
            </div>
          </div>
          <div className="phone-home-indicator">
            <div className="phone-home-indicator__bar" />
          </div>
        </div>
        <span className="platform-badge platform-badge--ios">iOS</span>
      </div>

      {/* Android Phone */}
      <div className="phone-frame-wrapper">
        <div className="phone-frame phone-frame--android identity-preview__phone-android-bg">
          <div className="phone-statusbar">
            <span>23:48</span>
            <div className="phone-statusbar__indicators">
              <div className="phone-statusbar__bar" />
              <div className="phone-statusbar__bar" />
              <div className="phone-statusbar__bar" />
            </div>
          </div>
          <div className="phone-apps phone-apps--android">
            <div className="phone-app">
              <div className="phone-app__icon" />
              <span className="phone-app__label">Play Store</span>
            </div>
            <div className="phone-app">
              <div className="phone-app__icon phone-app__icon--brand">
                {state.identityForm.appIcon
                  ? <img src={state.identityForm.appIcon} alt="App icon" />
                  : initials}
              </div>
              <span className="phone-app__label">{state.identityForm.appName}</span>
            </div>
          </div>
        </div>
        <span className="platform-badge platform-badge--android">Android</span>
      </div>

      {/* Notification Preview */}
      <div style={{ position: "relative", width: "300px" }}>
        <div className="notif-card">
          <div className="notif-card__icon">
            {state.identityForm.appIcon
              ? <img src={state.identityForm.appIcon} alt="App icon" />
              : initials}
          </div>
          <div>
            <p className="notif-card__title">{state.identityForm.appName}</p>
            <p className="notif-card__body">Ini adalah contoh notifikasi dari aplikasi mobile banking Anda.</p>
          </div>
        </div>
        <span className="platform-badge platform-badge--notif">Notifikasi</span>
      </div>
    </div>
  );
}
