// src/components/AddedItemsPanel.tsx
import React from 'react';

interface Item {
  id: string;
  type: string;
  length?: number;
  width?: number;
  diameter?: number;
  weight: number;
}

interface Props {
  items: Item[];
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function AddedItemsPanel({ items, onRotate, onRemove }: Props) {
  return (
    <div className="p-4 bg-white rounded shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Added Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {items.map((item, index) => (
          <div key={item.id} className="border rounded p-2 flex flex-col justify-between">
            <div className="font-semibold">#{index + 1}</div>
            <div>{item.length || item.diameter} x {item.width || item.diameter} cm</div>
            <div>{item.weight} kg</div>
            <div className="flex gap-2 mt-2">
              <button
                className="text-blue-500 text-xs underline"
                onClick={() => onRotate(item.id)}
              >
                Rotate
              </button>
              <button
                className="text-red-500 text-xs underline"
                onClick={() => onRemove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
