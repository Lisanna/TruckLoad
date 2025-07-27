import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

export default function TruckCanvas() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Truck Canvas</h2>
      <div className="overflow-auto border">
        <Stage width={800} height={400} className="bg-gray-100">
          <Layer>
            <Rect x={0} y={0} width={800} height={400} fill="#f3f4f6" stroke="#ccc" strokeWidth={2} />
            <Text text="Truck layout goes here" x={10} y={10} fontSize={16} fill="#555" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}