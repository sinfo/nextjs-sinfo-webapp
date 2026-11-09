"use client";

import { useState } from "react";

export function useReorderableList<T>(
  items: T[],
  onReorder: (newItems: T[]) => void,
) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const moveItem = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
  };

  const handleDragStart = (idx: number) => (e: React.DragEvent) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idx.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (dropIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      return;
    }

    const next = [...items];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(dropIdx, 0, moved);

    onReorder(next);
    setDraggedIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return {
    draggedIdx,
    moveItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
