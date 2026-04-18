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
    <aside className="right-col">
      <div className="right-col__tabs">
        <button
          onClick={() => dispatch({ type: "SET_RIGHT_TAB", tab: "properties" })}
          className={`right-col__tab${state.rightTab === "properties" ? " right-col__tab--active" : ""}`}
        >
          Properties
        </button>
        <button
          onClick={() => dispatch({ type: "SET_RIGHT_TAB", tab: "layers" })}
          className={`right-col__tab${state.rightTab === "layers" ? " right-col__tab--active" : ""}`}
        >
          Layers
        </button>
      </div>
      <div className="right-col__body">
        {state.rightTab === "properties" ? <PropertiesPanel /> : <LayersPanel />}
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
      <div className="right-col__empty">
        <p>Tidak ada komponen dipilih</p>
        <small>Klik komponen pada kanvas untuk mengedit propertinya.</small>
      </div>
    );
  }

  return (
    <div className="props-panel">
      <div className="props-panel__header">
        <p className="props-panel__name">{selectedComponent.label}</p>
        <p className="props-panel__type">Tipe: {selectedComponent.type}</p>
      </div>
      {selectedComponent.properties.map((prop) => (
        <div key={prop.key} className="props-panel__field">
          <label className="props-panel__field-label">{prop.label}</label>
          {prop.type === "text" && (
            <input
              type="text"
              className="props-panel__input"
              value={prop.value as string}
              onChange={(e) => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: e.target.value })}
            />
          )}
          {prop.type === "color" && (
            <div className="props-panel__color-row">
              <input
                type="color"
                className="props-panel__color-swatch"
                value={prop.value as string}
                onChange={(e) => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: e.target.value })}
              />
              <input
                type="text"
                className="props-panel__input"
                value={prop.value as string}
                onChange={(e) => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: e.target.value })}
              />
            </div>
          )}
          {prop.type === "number" && (
            <input
              type="number"
              className="props-panel__input"
              value={prop.value as number}
              onChange={(e) => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: parseInt(e.target.value) || 0 })}
            />
          )}
          {prop.type === "select" && (
            <select
              className="props-panel__select"
              value={prop.value as string}
              onChange={(e) => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: e.target.value })}
            >
              {prop.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}
          {prop.type === "toggle" && (
            <button
              className={`props-panel__toggle${prop.value ? " props-panel__toggle--on" : " props-panel__toggle--off"}`}
              onClick={() => dispatch({ type: "UPDATE_PROPERTY", componentId: selectedComponent.id, propertyKey: prop.key, value: !prop.value })}
            >
              <div className={`props-panel__toggle-thumb${prop.value ? " props-panel__toggle-thumb--on" : " props-panel__toggle-thumb--off"}`} />
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
      onClick={() => dispatch({ type: "SELECT_COMPONENT", componentId: component.id })}
      className={`layer-item${isSelected ? " layer-item--selected" : ""}`}
    >
      <button {...attributes} {...listeners} className="layer-item__drag">
        <GripVertical size={14} />
      </button>
      <div className="layer-item__info">
        <p className="layer-item__name">{component.label}</p>
        <p className="layer-item__type">{component.type}</p>
      </div>
      <button className="layer-item__vis">
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
      <div className="right-col__empty">
        <p>Tidak ada layer</p>
        <small>Pilih layar dengan komponen untuk melihat layer.</small>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={state.canvasComponents.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="layers-panel">
          {state.canvasComponents.map((comp) => (
            <LayerItem key={comp.id} component={comp} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
