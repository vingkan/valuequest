import React, { useState } from 'react';
import '../styles/SlidingPane.css';

export const SlidingPane: React.FC = () => {
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
          {/* Your content here */}
          <p>This is the pane content.</p>
        </div>
      </div>
    );
  };
