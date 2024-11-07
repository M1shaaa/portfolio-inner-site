import React from 'react';

const Thoughts: React.FC = () => {
  const thoughts = [
    "Why is good music good?",
    "How long would it take to heat up my food just by stirring it really fast?",
    "How much would I weigh if I never went to the bathroom?"
  ];

  return (
    <div className="site-page-content">
      <h1>What's cooking</h1>
      <h3>what's been cooking up top recently</h3>
      <br />
      <div className="text-block">
        {thoughts.map((thought, index) => (
          <div key={index} className="font-mono mb-4 last:mb-0">
            {`> ${thought}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thoughts;