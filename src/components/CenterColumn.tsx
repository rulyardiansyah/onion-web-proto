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

function ComponentBlock({ component }: { component: CanvasComponent }) {
  const { state, dispatch } = useDesigner();
  const isSelected = state.selectedComponentId === component.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() =>
        dispatch({ type: "SELECT_COMPONENT", componentId: component.id })
      }
      className={`group relative rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? "border-primary shadow-md shadow-primary/20"
          : "border-transparent hover:border-primary/30"
      }`}
    >
      <div
        className="flex items-center gap-2 px-3 py-3 rounded-md"
        style={{ backgroundColor: bgColors[component.type] || "#f8fafc" }}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-text-secondary/50 hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        >
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
        <div className="flex-1 flex items-center justify-between text-white text-xs font-medium py-1">
          <span>{component.properties.find((p) => p.key === "title")?.value as string}</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
          </div>
        </div>
      );
    case "banner":
      return (
        <div
          className="flex-1 flex items-center justify-center py-4 rounded"
          style={{ backgroundColor: component.properties.find((p) => p.key === "bgColor")?.value as string }}
        >
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
        </div>
      );
    case "balance-card":
      return (
        <div className="flex-1 py-1">
          <p className="text-[10px] text-text-secondary">Saldo Anda</p>
          <p className="text-sm font-bold text-text-primary">Rp 12.500.000</p>
        </div>
      );
    case "quick-menu":
      return (
        <div className="flex-1 flex gap-3 py-1">
          {["Transfer", "Bayar", "Beli", "Lainnya"].map((item) => (
            <div key={item} className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-primary/20" />
              <span className="text-[8px] text-text-secondary">{item}</span>
            </div>
          ))}
        </div>
      );
    case "promo-carousel":
      return (
        <div className="flex-1 flex gap-2 py-1">
          <div className="h-10 flex-1 rounded bg-amber-300/50" />
          <div className="h-10 flex-1 rounded bg-amber-200/50" />
        </div>
      );
    case "transaction-list":
      return (
        <div className="flex-1 space-y-1 py-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-200" />
                <span className="text-[9px] text-text-secondary">
                  Transaksi {i}
                </span>
              </div>
              <span className="text-[9px] font-medium">-Rp 50.000</span>
            </div>
          ))}
        </div>
      );
    case "notification-bar":
      return (
        <div className="flex-1 space-y-1 py-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-red-200" />
              <span className="text-[9px] text-text-secondary">
                Notifikasi {i}
              </span>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="flex-1 py-2">
          <p className="text-xs text-text-secondary">{component.label}</p>
        </div>
      );
  }
}

export default function CenterColumn() {
  const { state, dispatch } = useDesigner();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.canvasComponents.findIndex(
        (c) => c.id === active.id
      );
      const newIndex = state.canvasComponents.findIndex(
        (c) => c.id === over.id
      );
      const reordered = arrayMove(state.canvasComponents, oldIndex, newIndex);
      dispatch({ type: "REORDER_COMPONENTS", components: reordered });
    }
  }

  const isIdentity = state.selectedScreenId === "identity";

  return (
    <div className="flex-1 bg-canvas-bg flex items-center justify-center overflow-auto p-8">
      {isIdentity ? (
        <IdentityPreview />
      ) : (
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-[320px] bg-white rounded-[40px] shadow-xl border-[8px] border-gray-800 overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gray-800 text-white flex items-center justify-between px-6 py-2 text-[10px]">
              <span>23:48</span>
              <div className="w-20 h-5 bg-gray-900 rounded-full mx-auto" />
              <div className="flex gap-1">
                <div className="w-3 h-2 bg-white/70 rounded-sm" />
                <div className="w-3 h-2 bg-white/70 rounded-sm" />
                <div className="w-3 h-2 bg-white/70 rounded-sm" />
              </div>
            </div>

            {/* Canvas Content */}
            <div className="min-h-[500px] bg-gray-50">
              {state.canvasComponents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-text-secondary">
                  <Smartphone size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">Tidak ada komponen</p>
                  <p className="text-xs mt-1">
                    Pilih layar untuk mulai mendesain
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={state.canvasComponents.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-0.5 p-1">
                      {state.canvasComponents.map((comp) => (
                        <ComponentBlock key={comp.id} component={comp} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Home Indicator */}
            <div className="bg-gray-50 py-2 flex justify-center">
              <div className="w-24 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Platform Label */}
          <div className="absolute -top-2 -right-16 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
            iOS
          </div>
        </div>
      )}
    </div>
  );
}

function IdentityPreview() {
  const { state } = useDesigner();
  return (
    <div className="flex flex-col items-center gap-8">
      {/* iOS Phone */}
      <div className="relative">
        <div className="w-[300px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-[40px] shadow-xl border-[8px] border-gray-800 overflow-hidden">
          <div className="bg-gray-800 text-white flex items-center justify-between px-6 py-2 text-[10px]">
            <span>23:48</span>
            <div className="w-20 h-5 bg-gray-900 rounded-full mx-auto" />
            <div className="flex gap-1">
              <div className="w-3 h-2 bg-white/70 rounded-sm" />
              <div className="w-3 h-2 bg-white/70 rounded-sm" />
            </div>
          </div>
          <div className="p-6 flex flex-wrap gap-4 justify-center min-h-[200px]">
            {["Calendar", "Photos", "Camera", "Mail"].map((app) => (
              <div key={app} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-white/60 shadow-sm" />
                <span className="text-[9px] text-gray-600">{app}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-bold">
                  {state.identityForm.appName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-[9px] text-gray-600">
                {state.identityForm.appName}
              </span>
            </div>
          </div>
          <div className="py-2 flex justify-center">
            <div className="w-20 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
        <div className="absolute -top-2 -right-12 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          iOS
        </div>
      </div>

      {/* Android Phone */}
      <div className="relative">
        <div className="w-[300px] bg-gradient-to-br from-purple-200 to-pink-100 rounded-[24px] shadow-xl border-[4px] border-gray-800 overflow-hidden">
          <div className="bg-gray-800/80 text-white flex items-center justify-between px-4 py-1.5 text-[10px]">
            <span>23:48</span>
            <div className="flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              <div className="w-3 h-2 bg-white/70 rounded-sm" />
              <div className="w-3 h-2 bg-white/70 rounded-sm" />
              <div className="w-3 h-2 bg-white/70 rounded-sm" />
            </div>
          </div>
          <div className="p-6 flex flex-wrap gap-4 justify-center min-h-[180px]">
            {["Play Store"].map((app) => (
              <div key={app} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-white/60 shadow-sm" />
                <span className="text-[9px] text-gray-600">{app}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-bold">
                  {state.identityForm.appName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-[9px] text-gray-600">
                {state.identityForm.appName}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -top-2 -right-16 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          Android
        </div>
      </div>

      {/* Notification Preview */}
      <div className="relative w-[300px]">
        <div className="bg-white rounded-xl shadow-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">
              {state.identityForm.appName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">
              {state.identityForm.appName}
            </p>
            <p className="text-xs text-text-secondary">
              Ini adalah contoh notifikasi dari aplikasi mobile banking Anda.
            </p>
          </div>
        </div>
        <div className="absolute -top-2 -right-16 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
          Notifikasi
        </div>
      </div>
    </div>
  );
}
