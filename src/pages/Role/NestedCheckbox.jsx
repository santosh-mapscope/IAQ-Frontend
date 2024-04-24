/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const NestedCheckbox = ({  label, menuId, isChecked, onChange, children, parent}) => {
  // const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (e) => {
    onChange(e.target.checked);
  };
  


  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  // const handleCheckboxChange = () => {
  //   const newChecked = !checked;
  //   setChecked(newChecked);
  //   onChange(menuId, newChecked);
  // };

  const toggleChildCheckboxes = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div>
        <Form.Check className="check-box-wrap-1"
          type="checkbox"
          label={
            <>
              {isOpen ? (
                <FontAwesomeIcon icon={faCaretDown} onClick={toggleChildCheckboxes} className='mr-2'/>
              ) : (
                <FontAwesomeIcon icon={faCaretRight} onClick={toggleChildCheckboxes}  className='mr-2'/>
              )}
              {label}
            </>
          }
          checked={isChecked}
          onChange={handleCheckboxChange}
        />

        
      </div>

      {children && isOpen && (
        <div style={{ marginLeft: '20px' }}>{children}</div>
      )}
    </div>
  );
};

export default NestedCheckbox;
