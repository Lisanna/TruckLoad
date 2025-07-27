// src/App.tsx
import React, { useState } from 'react';
import TruckSelector from './components/TruckSelector';
import ItemForm from './components/ItemForm';
import TruckCanvas from './components/TruckCanvas';
import AxleLoadCalculator from './components/AxleLoadCalculator';
import AddedItemsPanel from './components/AddedItemsPanel';

export default function App() {
  const [items, setItems] = useState<any[]>([]);
  const [truck, setTruck] = useState({ length: 1360, width: 250, height: 270 });

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const rotateItem = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id && item.length && item.width) {
        return {
          ...item,
          length: item.width,
          width: item.length,
          x: null,
          y: null
        };
      }
      return item;
    }));
  };

  const handleAddItems = (newItems: any[]) => {
    const initialized = newItems.map(item => ({ ...item, x: null, y: null }));
    setItems(prev => [...prev, ...initialized]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Cargo Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1 space-y-4">
          <TruckSelector truck={truck} onChange={setTruck} />
          <ItemForm onAddItems={handleAddItems} />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="w-full overflow-auto">
            <TruckCanvas
              items={items}
              setItems={setItems}
              length={truck.length}
              width={truck.width}
            />
          </div>
          <AxleLoadCalculator items={items} />
        </div>
      </div>
      <AddedItemsPanel items={items} onRotate={rotateItem} onRemove={removeItem} />
    </div>
  );
}
