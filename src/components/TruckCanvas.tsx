import React, { useEffect } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useState } from 'react';

export default function TruckCanvas({ items, setItems }: { items: any[], setItems: (items: any[]) => void }) {
  const [dimensions] = useState({ width: 800, height: 400 });
  const spacing = 5; // gap between default placements

  const getSize = (item: any) => {
    const width = item.diameter || item.width;
    const height = item.diameter || item.length;
    return { width, height };
  };

  const isOverlappingWithAny = (x: number, y: number, width: number, height: number, currentIndex: number, placed: any[]) => {
    return placed.some((other, i) => {
      if (i === currentIndex || other.x == null || other.y == null) return false;
      const { width: ow, height: oh } = getSize(other);
      return x < other.x + ow && x + width > other.x && y < other.y + oh && y + height > other.y;
    });
  };

  const recomputeLayout = (inputItems: any[]) => {
    const placed: any[] = [];
    let cursorX = spacing;
    let cursorY = spacing;
    let rowHeight = 0;

    const updated = inputItems.map((item, index) => {
      const { width, height } = getSize(item);
      if (cursorX + width > dimensions.width) {
        cursorX = spacing;
        cursorY += rowHeight + spacing;
        rowHeight = 0;
      }

      while (isOverlappingWithAny(cursorX, cursorY, width, height, index, placed)) {
        cursorX += spacing + width;
        if (cursorX + width > dimensions.width) {
          cursorX = spacing;
          cursorY += rowHeight + spacing;
          rowHeight = 0;
        }
      }

      const positioned = { ...item, x: cursorX, y: cursorY };
      placed.push(positioned);
      cursorX += width + spacing;
      rowHeight = Math.max(rowHeight, height);
      return positioned;
    });

    setItems(updated);
  };

  useEffect(() => {
    if (items.length > 0 && items.some(item => item.x == null || item.y == null)) {
      recomputeLayout(items);
    }
  }, [items]);

  const isOverlapping = (newX: number, newY: number, index: number, itemSize: any) => {
    return items.some((item, i) => {
      if (i === index) return false;
      const otherSize = getSize(item);
      return (
        newX < item.x + otherSize.width && newX + itemSize.width > item.x &&
        newY < item.y + otherSize.height && newY + itemSize.height > item.y
      );
    });
  };

  const isInsideBounds = (x: number, y: number, itemSize: any) => {
    return (
      x >= 0 &&
      y >= 0 &&
      x + itemSize.width <= dimensions.width &&
      y + itemSize.height <= dimensions.height
    );
  };

  const handleDrag = (e: any, index: number) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const itemSize = getSize(items[index]);

    if (isInsideBounds(newX, newY, itemSize) && !isOverlapping(newX, newY, index, itemSize)) {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        x: newX,
        y: newY
      };
      setItems(updated);
    } else {
      // revert to previous position (do NOT recompute layout)
      e.target.to({ x: items[index].x, y: items[index].y });
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Truck Canvas</h2>
      <div className="overflow-auto border">
        <Stage width={dimensions.width} height={dimensions.height} className="bg-gray-100">
          <Layer>
            <Rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="#fefefe" stroke="#000" strokeWidth={2} />
            {items.map((item, index) => {
              const { width, height } = getSize(item);
              return (
                <Rect
                  key={item.id}
                  x={item.x}
                  y={item.y}
                  width={width}
                  height={height}
                  fill="#c084fc"
                  stroke="#7e22ce"
                  strokeWidth={1}
                  draggable
                  onDragEnd={(e) => handleDrag(e, index)}
                />
              );
            })}
            <Text text="Truck Floor" x={10} y={10} fontSize={16} fill="#555" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}