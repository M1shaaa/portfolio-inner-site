import React from 'react';

const Thoughts: React.FC = () => {
  const thoughts = [
    "Was a sip really good if you didn't make that noise after it?",
    "does a double yoke mean twins?",
    "why is it okay to say 'morning' or 'afternoon' to people but not 'fall' or 'winter'?",
    "is it a button-up or button-down?",
    "What format are computer files stored in to be universally accessible?",
    "why is sunday laundry day?",
    "do babies find other babies cute?",
    "if someone attacked me with their prothetic leg, is it considered hitting or kicking?",
    "is melted ice cream a soup?",
    "why am i not as happy as my dog to go on a walk or eat the same food every day?",
    "theoretically, how much could i eat of myself before dying?",
    "why are some bugs cute and not others?",
    "what makes a good question?",
    "at what point does a plate become a bowl?",
    "does food made with love really taste better?",
    "what makes some color palettes more appealing than others",
    "how do idioms come to be?",
    "where do we draw the line between words and non-words?",
    "how do we transmit information through light, like in fiber optic cables?",
    "what's the difference between learning and discovering something?",
    "How do cameras work?",
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