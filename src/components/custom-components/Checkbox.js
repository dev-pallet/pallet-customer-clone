import React, { useState } from 'react';
import './style.css'; // Import your CSS file

const SquareCheckBox = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
  };

  return (
    <div className="custom-square-radio-container">
      <div
        className={`custom-square-radio ${selectedOption === 'option1' ? 'checked' : ''}`}
        onClick={() => handleOptionClick('option1')}
      >
        {selectedOption === 'option1' && <div className="square-radio-content">&#10004;</div>}
      </div>
    </div>
  );
};

export default SquareCheckBox;
