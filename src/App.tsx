import React, { useState } from 'react';
import TruckSelector from './components/TruckSelector';
import ItemForm from './components/ItemForm';
import TruckCanvas from './components/TruckCanvas';

export default function App() {
  const [items, setItems] = useState<any[]>([]);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const rotateItem = (id: number) => {
    setItems(items.map(item => {
      if (item.id === id && item.length && item.width) {
        return {
          ...item,
          length: item.width,
          width: item.length
        };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Cargo Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <TruckSelector />
          <ItemForm onAddItems={(newItems) => setItems([...items, ...newItems])} />
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Added Items</h2>
            <ul className="text-sm space-y-2">
              {items.map((item, i) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>
                    {item.type} — {item.length || item.diameter} x {item.width || item.diameter} cm, {item.weight} kg
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 text-xs underline"
                      onClick={() => rotateItem(item.id)}
                    >
                      Rotate
                    </button>
                    <button
                      className="text-red-500 text-xs underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-2">
          <TruckCanvas items={items} setItems={setItems} />
        </div>
      </div>
    </div>
  );
}
