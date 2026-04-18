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
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { useDesigner, type CanvasComponent } from "@/store/designer-store";

export default function RightColumn() {
  const { state, dispatch } = useDesigner();

  return (
    <aside className="w-72 bg-white border-l border-border flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => dispatch({ type: "SET_RIGHT_TAB", tab: "properties" })}
          className={`flex-1 text-sm py-3 font-medium transition-colors ${
            state.rightTab === "properties"
              ? "text-primary border-b-2 border-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => dispatch({ type: "SET_RIGHT_TAB", tab: "layers" })}
          className={`flex-1 text-sm py-3 font-medium transition-colors ${
            state.rightTab === "layers"
              ? "text-primary border-b-2 border-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Layers
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {state.rightTab === "properties" ? (
          <PropertiesPanel />
        ) : (
          <LayersPanel />
        )}
      </div>
    </aside>
  );
}

function PropertiesPanel() {
  const { state, dispatch } = useDesigner();

  const selectedComponent = state.canvasComponents.find(
    (c) => c.id === state.selectedComponentId
  );

  if (!selectedComponent) {
    return (
      <div className="p-6 text-center text-text-secondary">
        <p className="text-sm">Tidak ada komponen dipilih</p>
        <p className="text-xs mt-1">Klik komponen pada kanvas untuk mengedit propertinya.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="pb-3 border-b border-border">
        <h3 className="text-sm font-semibold">{selectedComponent.label}</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Tipe: {selectedComponent.type}
        </p>
      </div>

      {selectedComponent.properties.map((prop) => (
        <div key={prop.key}>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            {prop.label}
          </label>
          {prop.type === "text" && (
            <input
              type="text"
              value={prop.value as string}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROPERTY",
                  componentId: selectedComponent.id,
                  propertyKey: prop.key,
                  value: e.target.value,
                })
              }
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          )}
          {prop.type === "color" && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={prop.value as string}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_PROPERTY",
                    componentId: selectedComponent.id,
                    propertyKey: prop.key,
                    value: e.target.value,
                  })
                }
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={prop.value as string}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_PROPERTY",
                    componentId: selectedComponent.id,
                    propertyKey: prop.key,
                    value: e.target.value,
                  })
                }
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          )}
          {prop.type === "number" && (
            <input
              type="number"
              value={prop.value as number}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROPERTY",
                  componentId: selectedComponent.id,
                  propertyKey: prop.key,
                  value: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          )}
          {prop.type === "select" && (
            <select
              value={prop.value as string}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROPERTY",
                  componentId: selectedComponent.id,
                  propertyKey: prop.key,
                  value: e.target.value,
                })
              }
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {prop.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {prop.type === "toggle" && (
            <button
              onClick={() =>
                dispatch({
                  type: "UPDATE_PROPERTY",
                  componentId: selectedComponent.id,
                  propertyKey: prop.key,
                  value: !prop.value,
                })
              }
              className={`relative w-10 h-5 rounded-full transition-colors ${
                prop.value ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  prop.value ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function LayerItem({ component }: { component: CanvasComponent }) {
  const { state, dispatch } = useDesigner();
  const isSelected = state.selectedComponentId === component.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() =>
        dispatch({ type: "SELECT_COMPONENT", componentId: component.id })
      }
      className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors border-l-2 ${
        isSelected
          ? "bg-primary-light border-primary"
          : "border-transparent hover:bg-gray-50"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-text-secondary/50 hover:text-text-secondary"
      >
        <GripVertical size={14} />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{component.label}</p>
        <p className="text-[10px] text-text-secondary">{component.type}</p>
      </div>
      <button className="text-text-secondary hover:text-text-primary">
        <Eye size={14} />
      </button>
    </div>
  );
}

function LayersPanel() {
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

  if (state.canvasComponents.length === 0) {
    return (
      <div className="p-6 text-center text-text-secondary">
        <p className="text-sm">Tidak ada layer</p>
        <p className="text-xs mt-1">Pilih layar dengan komponen untuk melihat layer.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={state.canvasComponents.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="divide-y divide-border">
          {state.canvasComponents.map((comp) => (
            <LayerItem key={comp.id} component={comp} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
