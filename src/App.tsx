import React from 'react';
import TruckSelector from './components/TruckSelector';
import ItemForm from './components/ItemForm';
import TruckCanvas from './components/TruckCanvas';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Cargo Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <TruckSelector />
          <ItemForm />
        </div>
        <div className="md:col-span-2">
          <TruckCanvas />
        </div>
      </div>
    </div>
  );
}