// src/components/showcase/projects/Thoughts.tsx
import React from 'react';

const Thoughts: React.FC = () => {
  const thoughts = [
    "Why is good music good?",
    "How long would it take to heat up my food just by stirring it really fast?",
    "How much would I weigh if I never went to the bathroom?"
  ];

  return (
    <div className="site-page-content">
      <div className="bg-gray-200 p-4 rounded-lg border-2 border-gray-400 shadow-md">
        <div className="bg-gray-800 text-white p-2 rounded-t flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="mx-auto font-mono">Brain.exe</span>
        </div>
        
        <h1 className="font-mono text-2xl mb-4">my current brain loop</h1>
        
        <div className="bg-white p-4 rounded border border-gray-400">
          {thoughts.map((thought, index) => (
            <div 
              key={index} 
              className="font-mono mb-4 last:mb-0 cursor-pointer hover:text-blue-600"
            >
              {`> ${thought}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
