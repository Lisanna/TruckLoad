import React, { useState } from 'react';

interface Props {
  onAddItems: (items: any[]) => void;
}

export default function ItemForm({ onAddItems }: Props) {
  const [selectedOption, setSelectedOption] = useState('pallet');
  const [form, setForm] = useState({
    type: 'pallet',
    length: 120,
    width: 80,
    diameter: 0,
    weight: 25,
    quantity: '1'
  });

  const handleChange = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleTypeChange = (value: string) => {
    setSelectedOption(value);

    if (value === 'tank_small') {
      setForm({ type: 'tank', diameter: 60, length: 0, width: 0, weight: 50, quantity: '1' });
    } else if (value === 'tank_large') {
      setForm({ type: 'tank', diameter: 100, length: 0, width: 0, weight: 80, quantity: '1' });
    } else if (value === 'pallet') {
      setForm({ type: 'pallet', length: 120, width: 80, diameter: 0, weight: 25, quantity: '1' });
    } else if (value === 'ewc') {
      setForm({ type: 'ewc', length: 120, width: 80, diameter: 0, weight: 20, quantity: '1' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(form.quantity);
    if (!qty || qty < 1) return;

    const items = Array.from({ length: qty }).map((_, i) => ({
      id: `${selectedOption}-${Date.now()}-${i}`,
      type: form.type,
      length: form.length,
      width: form.width,
      diameter: form.diameter,
      weight: form.weight
    }));

    onAddItems(items);
    setForm({ ...form, quantity: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-2">
      <h2 className="text-lg font-semibold">Add Item</h2>

      <label className="block text-sm">
        Type of item:
        <select
          className="border p-1 rounded ml-2"
          value={selectedOption}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="pallet">Pallet</option>
          <option value="ewc">EWC (stackable)</option>
          <option value="tank_small">Tank (Small)</option>
          <option value="tank_large">Tank (Large)</option>
        </select>
      </label>

      {form.type !== 'tank' ? (
        <>
          <label className="block text-sm">
            Length (cm):
            <input
              type="number"
              className="border p-1 rounded ml-2"
              value={form.length}
              onChange={(e) => handleChange('length', Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            Width (cm):
            <input
              type="number"
              className="border p-1 rounded ml-2"
              value={form.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
            />
          </label>
        </>
      ) : (
        <label className="block text-sm">
          Diameter (cm):
          <input
            type="number"
            className="border p-1 rounded ml-2"
            value={form.diameter}
            onChange={(e) => handleChange('diameter', Number(e.target.value))}
          />
        </label>
      )}

      <label className="block text-sm">
        Weight per item (kg):
        <input
          type="number"
          className="border p-1 rounded ml-2"
          value={form.weight}
          onChange={(e) => handleChange('weight', Number(e.target.value))}
        />
      </label>

      <label className="block text-sm">
        Quantity:
        <input
          type="text"
          className="border p-1 rounded ml-2"
          value={form.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          placeholder="e.g. 30"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}
