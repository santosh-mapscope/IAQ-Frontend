// SidebarButton.js
import React from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const SidebarButton = ({ collapsed, handleCollapsedChange,handleToggleSidebar  }) => {
  const handleButtonClick = () => {
    handleCollapsedChange(); 
    handleToggleSidebar ();
  };

  return (
    <div className="sidebar-button">
      <button onClick={handleButtonClick}>
        {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
    </div>
  );
};

export default SidebarButton;
 