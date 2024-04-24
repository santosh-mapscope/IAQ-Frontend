import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PiArrowLeft } from 'react-icons/pi'; // Importing the PiArrowLeft icon

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <button
      onClick={goBack}
      style={{
        backgroundColor: '#0d6efd', // Set the background color to blue
        color: 'white', // Set the text color to white
        padding: '8px 16px', // Add padding for better appearance
        border: 'none', // Remove default button border
        borderRadius: '4px', // Add border radius for rounded corners
        cursor: 'pointer', // Show pointer cursor on hover
        display: 'flex', // Set display to flex for aligning icon and text
        alignItems: 'center', // Align items to the center
      }}
    >
      <PiArrowLeft style={{ marginRight: '8px' }} /> {/* Icon */}
      Back
    </button>
  );
};

export default BackButton;