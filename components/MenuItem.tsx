import React, { useState } from "react";
import { ReactNode } from "react";

const MenuItem = ({ label, children } : { label: ReactNode, children: ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        // onClick={() => {}}
        className="flex justify-between items-center w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        {label}
        {/* <span>{isOpen ? "-" : "+"}</span> */}
      </button>

      {isOpen && (
        <div className="ml-4 mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default MenuItem;