
import React from "react";

export const Button = ({ children, onClick, variant = "default", className = "" }) => {
  const baseStyle = "px-4 py-2 rounded text-white font-semibold";
  const styles = {
    default: `${baseStyle} bg-blue-500 hover:bg-blue-600`,
    ghost: `${baseStyle} bg-transparent text-red-500 hover:underline`,
  };
  return (
    <button onClick={onClick} className={`${styles[variant] || baseStyle} ${className}`}>
      {children}
    </button>
  );
};