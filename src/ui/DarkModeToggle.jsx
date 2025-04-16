import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../redux/tasksSlice";

function DraggableButton() {
  const [position, setPosition] = useState({
    x: window.innerWidth / 4,
    y: 50,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [moved, setMoved] = useState(false);

  const darkMode = useSelector((state) => state.operations.isDarkMode);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setMoved(false);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setMoved(false);
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setMoved(true);
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setMoved(true);
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - offset.x,
      y: touch.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      // Mouse Events
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Touch Events for mobile
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      // Clean up event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, offset]);

  const handleClick = () => {
    if (!moved) {
      dispatch(toggleDarkMode());
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        padding: "12px 20px",
        background: darkMode ? "#1a202c" : "#fff", // Dark mode vs light mode
        color: darkMode ? "#fff" : "#333", // Light text on dark, dark text on light
        borderRadius: "10px", // جعل الزر بتصميم مربع مع حواف مدورة
        border: `2px solid ${darkMode ? "#FFD700" : "#333"}`, // Border color change based on mode
        fontSize: "18px",
        cursor: isDragging ? "grabbing" : "grab",
        transition: "background 0.3s, color 0.3s, transform 0.2s ease-in-out",
        transform: moved ? "scale(1.1)" : "scale(1)", // Slight zoom effect when dragged
        userSelect: "none",
        boxShadow: darkMode
          ? "0 4px 8px rgba(0, 0, 0, 0.5)"
          : "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}

export default DraggableButton;
