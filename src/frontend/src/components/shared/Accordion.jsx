import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Accordion = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-2">
      {data.map((item, index) => (
        <div key={index} className="border-t-2 border-black">
          {/*  */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <span className="text-lg font-medium text-gray-900">
              {item.title}
            </span>
            <ExpandMoreIcon
              className={`text-gray-500 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              style={{ fontSize: '1.25rem' }}
            />
          </button>
          
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-4 pr-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;