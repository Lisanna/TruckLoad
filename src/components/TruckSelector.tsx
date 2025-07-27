// src/components/TruckSelector.tsx
import React from 'react';

interface Props {
  truck: { length: number; width: number; height: number };
  onChange: (truck: { length: number; width: number; height: number }) => void;
}

const defaultPresets = {
  Flatbed: { length: 1360, width: 245, height: 270 },
  Refrigerated: { length: 1320, width: 240, height: 250 },
  Container: { length: 1200, width: 235, height: 260 }
};

export default function TruckSelector({ truck, onChange }: Props) {
  const handleChange = (field: keyof typeof truck, value: number) => {
    onChange({ ...truck, [field]: value });
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Truck Dimensions</h2>
      <div className="space-y-2">
        <label className="block text-sm">
          Preset:
          <select
            className="border p-1 rounded ml-2"
            onChange={(e) => {
              const preset = defaultPresets[e.target.value as keyof typeof defaultPresets];
              if (preset) {
                onChange(preset);
              }
            }}
          >
            {Object.keys(defaultPresets).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Length (cm):
          <input
            type="number"
            className="border p-1 rounded ml-2"
            value={truck.length}
            onChange={(e) => handleChange('length', Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          Width (cm):
          <input
            type="number"
            className="border p-1 rounded ml-2"
            value={truck.width}
            onChange={(e) => handleChange('width', Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          Height (cm):
          <input
            type="number"
            className="border p-1 rounded ml-2"
            value={truck.height}
            onChange={(e) => handleChange('height', Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
