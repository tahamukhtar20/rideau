import { useEffect, useRef } from "react";

function useDragger(
  id: string,
  x: number,
  y: number,
  isResizing: boolean
): void {
  const isClicked = useRef<boolean>(false);

  const coords = useRef<{
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
  }>({
    startX: x,
    startY: y,
    lastX: x,
    lastY: y,
  });

  useEffect(() => {
    const target = document.getElementById(id);
    if (!target) throw new Error("Element with given id doesn't exist");

    const container = target.parentElement;
    if (!container) throw new Error("target element must have a parent");

    const onMouseDown = (e: MouseEvent) => {
      if (!isResizing) {
        isClicked.current = true;
        coords.current.startX = e.clientX;
        coords.current.startY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isClicked.current = false;
      coords.current.lastX =
        parseInt(target.style.transform?.split("(")[1]) || 0;
      coords.current.lastY =
        parseInt(target.style.transform?.split(",")[1]) || 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current || isResizing) return;
      const offsetX = e.clientX - coords.current.startX;
      const offsetY = e.clientY - coords.current.startY;
      const nextX = coords.current.lastX + offsetX;
      const nextY = coords.current.lastY + offsetY;
      target.style.transform = `translate(${nextX}px, ${nextY}px)`;
    };

    target.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      target.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [id, isResizing]);
}

export default useDragger;
