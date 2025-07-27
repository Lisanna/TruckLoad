// src/components/TruckCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

interface TruckCanvasProps {
  items: any[];
  setItems: (items: any[]) => void;
  length: number;
  width: number;
}

export default function TruckCanvas({ items, setItems, length, width }: TruckCanvasProps) {
  const spacing = 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.offsetWidth;
      const newScale = (availableWidth * 0.95) / (length + 600); // includes staging area
      setScale(newScale);
    }
  }, [length, width]);

  const getSize = (item: any) => {
    const w = item.diameter || item.width;
    const h = item.diameter || item.length;
    return { width: w, height: h };
  };

  const isOverlapping = (x: number, y: number, w: number, h: number, ignoreId: string) => {
    return items.some((other) => {
      if (other.id === ignoreId || other.x == null || other.y == null) return false;
      const { width: ow, height: oh } = getSize(other);
      return x < other.x + ow && x + w > other.x && y < other.y + oh && y + h > other.y;
    });
  };

  const recomputeLayout = () => {
    const placed: any[] = [];
    const unplaced: any[] = [];
    let cursorX = spacing;
    let cursorY = spacing;
    let rowHeight = 0;

    const updated = items.map((item) => {
      if (item.x != null && item.y != null) return item;
      const { width: w, height: h } = getSize(item);

      if (cursorX + w > length) {
        cursorX = spacing;
        cursorY += rowHeight + spacing;
        rowHeight = 0;
      }

      if (cursorY + h > width) {
        const holdingX = length + spacing * 2;
        const holdingY = spacing + unplaced.length * (h + spacing);
        return { ...item, x: holdingX, y: holdingY, unplaced: true };
      }

      const positioned = { ...item, x: cursorX, y: cursorY, unplaced: false };
      placed.push(positioned);
      cursorX += w + spacing;
      rowHeight = Math.max(rowHeight, h);
      return positioned;
    });

    setItems(updated);
  };

  useEffect(() => {
    if (items.some(item => item.x == null || item.y == null)) {
      recomputeLayout();
    }
  }, [items]);

  const handleDrag = (e: any, index: number) => {
    const newX = e.target.x() / scale;
    const newY = e.target.y() / scale;
    const item = items[index];
    const { width: w, height: h } = getSize(item);

    const overlapping = isOverlapping(newX, newY, w, h, item.id);

    if (!overlapping) {
      const updated = [...items];
      updated[index] = { ...item, x: newX, y: newY, unplaced: newX > length };
      setItems(updated);
    } else {
      e.target.to({ x: item.x * scale, y: item.y * scale });
    }
  };

  return (
    <div className="bg-white rounded shadow p-4" ref={containerRef}>
      <h2 className="text-lg font-semibold mb-2">Truck Canvas</h2>
      <Stage width={(length + 600) * scale} height={width * scale} className="bg-gray-100">
        <Layer>
          <Rect x={0} y={0} width={length * scale} height={width * scale} stroke="black" strokeWidth={2} fill="#f9fafb" />
          {items.map((item, index) => {
            const { width: w, height: h } = getSize(item);
            const label = `${index + 1}`;
            const fill = {
              pallet: '#60a5fa',
              ewc: '#34d399',
              tank: '#f87171'
            }[item.type?.toLowerCase()] || '#ddd';

            const opacity = item.unplaced ? 0.5 : 1;

            return item.diameter ? (
              <React.Fragment key={item.id}>
                <Circle
                  x={(item.x + w / 2) * scale}
                  y={(item.y + w / 2) * scale}
                  radius={(w / 2) * scale}
                  fill={fill}
                  stroke="black"
                  opacity={opacity}
                  draggable
                  onDragEnd={(e) => handleDrag(e, index)}
                />
                <Text x={(item.x + 4) * scale} y={(item.y + 4) * scale} text={label} fontSize={10} fill="#000" />
              </React.Fragment>
            ) : (
              <React.Fragment key={item.id}>
                <Rect
                  x={item.x * scale}
                  y={item.y * scale}
                  width={w * scale}
                  height={h * scale}
                  fill={fill}
                  stroke="black"
                  opacity={opacity}
                  draggable
                  onDragEnd={(e) => handleDrag(e, index)}
                />
                <Text x={(item.x + 4) * scale} y={(item.y + 4) * scale} text={label} fontSize={10} fill="#000" />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
