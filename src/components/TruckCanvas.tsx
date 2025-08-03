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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(length + 400);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const TRUCK_Y = 40;
  const LOADING_BAY_HEIGHT = 300;
  const CANVAS_HEIGHT = width + LOADING_BAY_HEIGHT + TRUCK_Y + 60;

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth;
        setCanvasWidth(availableWidth);
        const newScale = availableWidth / (length + 400);
        setScale(newScale);
      }
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
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

  const handleDragEnd = (e: any, index: number) => {
    const node = e.target;
    const newX = node.x() / scale;
    const newY = node.y() / scale;
    const item = items[index];
    const { width: w, height: h } = getSize(item);

    const TRUCK_LEFT = 200;
    const TRUCK_RIGHT = TRUCK_LEFT + length;
    const TRUCK_TOP = TRUCK_Y;
    const TRUCK_BOTTOM = TRUCK_TOP + width;
    const STICK_RADIUS = 20;

    let snappedX = newX;
    let snappedY = newY;

    if (Math.abs(newX - TRUCK_LEFT) < STICK_RADIUS) snappedX = TRUCK_LEFT;
    else if (Math.abs(newX + w - TRUCK_RIGHT) < STICK_RADIUS) snappedX = TRUCK_RIGHT - w;

    if (Math.abs(newY - TRUCK_TOP) < STICK_RADIUS) snappedY = TRUCK_TOP;
    else if (Math.abs(newY + h - TRUCK_BOTTOM) < STICK_RADIUS) snappedY = TRUCK_BOTTOM - h;

    const inTruck = snappedY >= TRUCK_TOP && snappedY + h <= TRUCK_BOTTOM && snappedX >= TRUCK_LEFT && snappedX + w <= TRUCK_RIGHT;
    const inLoadingBay = newY > TRUCK_BOTTOM;

    if (!isOverlapping(snappedX, snappedY, w, h, item.id) && inTruck) {
      const updated = [...items];
      updated[index] = { ...item, x: snappedX, y: snappedY, unplaced: false };
      setItems(updated);
    } else if (!isOverlapping(newX, newY, w, h, item.id) && inLoadingBay) {
      const updated = [...items];
      updated[index] = { ...item, x: newX, y: newY, unplaced: true };
      setItems(updated);
    } else {
      node.to({ x: item.x * scale, y: item.y * scale });
    }
  };

  const assignInitialPositions = (incoming: any[]) => {
    const updated = [...incoming];
    let cursorX = 10;
    let cursorY = width + TRUCK_Y + 60;
    let rowHeight = 0;

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].x == null || updated[i].y == null) {
        const { width: w, height: h } = getSize(updated[i]);
        if (cursorX + w > canvasWidth - 10) {
          cursorX = 10;
          cursorY += rowHeight + 10;
          rowHeight = 0;
        }
        updated[i].x = cursorX;
        updated[i].y = cursorY;
        cursorX += w + 10;
        rowHeight = Math.max(rowHeight, h);
      }
    }
    return updated;
  };

  useEffect(() => {
    const hasUnplaced = items.some(item => item.x == null || item.y == null);
    if (hasUnplaced) {
      const updated = assignInitialPositions(items);
      setItems(updated);
    }
  }, [items]);

  return (
    <div className="bg-white rounded shadow p-4 overflow-auto" ref={containerRef}>
      <h2 className="text-lg font-semibold mb-2">Truck Canvas</h2>

      <div
        className={`transform origin-top-left transition-transform duration-300 ${
          isPortrait ? 'rotate-90 translate-y-[100vh]' : ''
        }`}
      >
        <Stage width={canvasWidth} height={CANVAS_HEIGHT * scale} className="bg-gray-100">
          <Layer>
            {/* Truck rectangle */}
            <Rect
              x={200 * scale}
              y={TRUCK_Y * scale}
              width={length * scale}
              height={width * scale}
              stroke="black"
              strokeWidth={2}
              fill="#f9fafb"
            />

            {/* Loading bay background */}
            <Rect
              x={0}
              y={(width + TRUCK_Y + 40) * scale}
              width={canvasWidth}
              height={LOADING_BAY_HEIGHT * scale}
              fill="#f3f4f6"
              stroke="gray"
              strokeWidth={1}
            />

            <Text
              x={10}
              y={(width + TRUCK_Y + 50) * scale}
              text="Loading Bay"
              fontSize={16}
              fill="navy"
            />

            {items.map((item, index) => {
              const { width: w, height: h } = getSize(item);
              const label = `${index + 1}`;
              const fill = {
                pallet: '#60a5fa',
                ewc: '#34d399',
                tank: '#f87171'
              }[item.type?.toLowerCase()] || '#ddd';

              return item.diameter ? (
                <React.Fragment key={item.id}>
                  <Circle
                    x={(item.x + w / 2) * scale}
                    y={(item.y + h / 2) * scale}
                    radius={(w / 2) * scale}
                    fill={fill}
                    stroke="black"
                    draggable
                    onDragEnd={(e) => handleDragEnd(e, index)}
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
                    draggable
                    onDragEnd={(e) => handleDragEnd(e, index)}
                  />
                  <Text x={(item.x + 4) * scale} y={(item.y + 4) * scale} text={label} fontSize={10} fill="#000" />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
