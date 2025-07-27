// src/components/AxleLoadCalculator.tsx
import React, { useMemo, useState } from 'react';

interface Props {
  items: any[];
}

export default function AxleLoadCalculator({ items }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [frontAxle, setFrontAxle] = useState(0); // cm from origin
  const [rearAxle, setRearAxle] = useState(900); // cm from origin
  const [truckDimensions, setTruckDimensions] = useState({ length: 1360, width: 250 });


  const result = useMemo(() => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let frontLoad = 0;
    let rearLoad = 0;

    items.forEach((item) => {
      const itemLength = item.diameter || item.length;
      const itemWidth = item.diameter || item.width;
      const centerX = item.x + (itemWidth / 2);

      const dRear = Math.abs(centerX - rearAxle);
      const dFront = Math.abs(centerX - frontAxle);
      const total = dRear + dFront;

      const rearShare = total > 0 ? dFront / total : 0.5;
      const frontShare = 1 - rearShare;

      rearLoad += rearShare * item.weight;
      frontLoad += frontShare * item.weight;
    });

    return {
      totalWeight,
      frontAxle: frontLoad,
      rearAxle: rearLoad,
      warnings: [
        frontLoad > 7500 ? '⚠️ Front axle exceeds 7.5t' : null,
        rearLoad > 11500 ? '⚠️ Rear axle exceeds 11.5t' : null
      ].filter(Boolean)
    };
  }, [items, frontAxle, rearAxle]);

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Axle Load Calculator</h2>
      <p>Total Weight: {result.totalWeight.toFixed(1)} kg</p>
      <p>Front Axle Load: {result.frontAxle.toFixed(1)} kg</p>
      <p>Rear Axle Load: {result.rearAxle.toFixed(1)} kg</p>
      {result.warnings.length > 0 && (
        <ul className="text-red-600 mt-2 list-disc list-inside">
          {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      )}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-blue-500 underline text-sm"
      >
        {showDetails ? 'Hide' : 'Edit'} Axle Settings
      </button>
      {showDetails && (
        <div className="mt-2 space-y-2">
          <label className="block text-sm">
            Front Axle Position (cm):
            <input
              type="number"
              className="border p-1 rounded ml-2"
              value={frontAxle}
              onChange={(e) => setFrontAxle(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            Rear Axle Position (cm):
            <input
              type="number"
              className="border p-1 rounded ml-2"
              value={rearAxle}
              onChange={(e) => setRearAxle(Number(e.target.value))}
            />
          </label>
        </div>
      )}
    </div>
  );
}
