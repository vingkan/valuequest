import React, { useState } from 'react';
import '../styles/SlidingPane.css';

export function SlidingPane({ children }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const togglePane = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className={`sliding-pane ${isOpen ? 'open' : ''}`}>
        <div className={`tab ${isOpen ? 'open' : ''}`} onClick={togglePane}>
          <div className="arrow"></div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    );
  };
