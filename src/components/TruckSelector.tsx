import React, { useState } from 'react';

const defaultTrucks = {
  "Standard Pianale": { length: 1360, width: 245 },
  "Frigo Truck": { length: 1360, width: 245 },
  "Container 40ft": { length: 1200, width: 235 }
};

export default function TruckSelector() {
  const [truck, setTruck] = useState("Standard Pianale");
  const [custom, setCustom] = useState(defaultTrucks[truck]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTruck(selected);
    setCustom(defaultTrucks[selected]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustom({
      ...custom,
      [e.target.name]: parseInt(e.target.value) || 0
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Select Truck</h2>
      <select className="w-full p-2 border rounded mb-2" value={truck} onChange={handleSelect}>
        {Object.keys(defaultTrucks).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <div className="space-y-2">
        <input name="length" value={custom.length} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Length (cm)" type="number" />
        <input name="width" value={custom.width} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Width (cm)" type="number" />
      </div>
    </div>
  );
}
