import React from 'react';

const Thoughts: React.FC = () => {
  const thoughts = [
    "How do cameras even work?",
    "Why do cats purr but dogs bark?",
    "What is the human equivalent of plants using scent signals?",
    "Why do we experience time linearly?",
    "Why are most humans right-handed, and do other species show similar patterns?",
    "At what point do people stop being strangers?",
    "Why do old books smell like old books?",
    "At what point do ingredients become a dish?",
    "Is heat required for cooking?",
    "What makes 'good' music 'good'?",
    "Why do I enjoy watching food videos while I'm eating?",
    "How do animals know their migration routes from birth?",
    "How do qubits carry information?",
    "Social norms??",
    "Should it be the case that almost all Wikipedia links to eventually lead to 'Philosophy'?",
    "Why do we tend to hold babies on our left side?",
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