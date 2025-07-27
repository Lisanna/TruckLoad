import React, { useState } from 'react';

const itemDefaults = {
  pallet: { length: 120, width: 80, weight: 25 },
  tank_small: { diameter: 60, weight: 50 },
  tank_big: { diameter: 100, weight: 80 },
  ewc_800x1200: { length: 120, width: 80, weight: 30 },
  ewc_1000x1200: { length: 120, width: 100, weight: 35 }
};

export default function ItemForm() {
  const [type, setType] = useState("pallet");
  const [details, setDetails] = useState(itemDefaults[type]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setType(selected);
    setDetails(itemDefaults[selected]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({
      ...details,
      [e.target.name]: parseInt(e.target.value) || 0
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Cargo Item</h2>
      <form className="space-y-2">
        <select className="w-full p-2 border rounded" value={type} onChange={handleTypeChange}>
          <option value="pallet">Pallet (120x80)</option>
          <option value="tank_small">Tank Small (60Ø)</option>
          <option value="tank_big">Tank Big (100Ø)</option>
          <option value="ewc_800x1200">EWC 800x1200</option>
          <option value="ewc_1000x1200">EWC 1000x1200</option>
        </select>
        {details.length && <input name="length" value={details.length} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Length (cm)" type="number" />}
        {details.width && <input name="width" value={details.width} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Width (cm)" type="number" />}
        {details.diameter && <input name="diameter" value={details.diameter} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Diameter (cm)" type="number" />}
        <input name="weight" value={details.weight} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Weight (kg)" type="number" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
}