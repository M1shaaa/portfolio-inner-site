import React from 'react';

export interface OpenScienceResourcesProps {}

const OpenScienceResources: React.FC<OpenScienceResourcesProps> = () => {
   return (
       <div className="site-page-content">
           <h1>Open Science</h1>
           <h3>Resources I Find Helpful</h3>
           <br />
           <div className="text-block">
               <p>
               Inspired by my former mentor, Rosie Aboody, I'm dedicated to promoting open science practices. 
               Below you can find some resources (either of my own or others) that I hope will be of help. 
               As I've found, inequitable access to resources is a huge barrier in academia; I hope this is at 
               least a step in the right direction toward dismantling these systemic barriers. 
               </p>
               <br />
           </div>

           <h2>Learning Resources</h2>
           <ul>
               <li><a href="https://docs.google.com/document/d/1emwVBo-zgxbtzBD7vyQBjHvQnoXnNa7qHD-NlDitsjU/edit" target="_blank" rel="noopener noreferrer">Professional Development with Dr. Dunham</a></li>
               <li><a href="https://foregoing-surfboard-ae6.notion.site/Intro-to-R-programming-e32d3cb749de410f8240fa3ac4a60f8a" target="_blank" rel="noopener noreferrer">Intro to programming in R</a> from Aaron Baker</li>
               <li><a href="https://probmods.org/" target="_blank" rel="noopener noreferrer">ProbMods</a> - Probabilistic Models of Cognition</li>
           </ul>

           <h2>My Portfolio</h2>
           <ul>
               <li><a href="https://www.kaggle.com/code/mishaokeeffe/mishamnist" target="_blank" rel="noopener noreferrer">MNIST neural network classifier</a></li>
               <li><a href="https://drive.google.com/drive/folders/17uDqaQGKFVH_Syx5Er6OvcdSXh34CBTf" target="_blank" rel="noopener noreferrer">Application Materials</a></li>
               <li><a href="https://drive.google.com/file/d/1WzYFz0r-UctfGudL093PDIL_sNtxwKgX/view" target="_blank" rel="noopener noreferrer">NASA Mission Concept Proposal PDR</a></li>
           </ul>

           <h2>Career Resources</h2>
           <ul>
               <li><a href="https://puddle-wealth-097.notion.site/Post-Bac-b6452ddc092f48b2b85de5fac19ac831?pvs=4" target="_blank" rel="noopener noreferrer">All things post-bacc</a> 
               - various listings for for post-baccalaureate opportunities</li>
           </ul>

           <h2>Other Websites I love</h2>
           <p>Here are some other websites (from some really cool people) that inspired me when making this one:</p>
           <ul>
               <li><a href="https://cs.stanford.edu/~kach/" target="_blank" rel="noopener noreferrer">Kartik Chandra</a></li>
               <li><a href="https://www.michellewong.page/home" target="_blank" rel="noopener noreferrer">Michelle Wong</a></li>
               <li><a href="https://kefangpsych.github.io/intro.html" target="_blank" rel="noopener noreferrer">Ke Fang</a></li>
               <li><a href="https://www.adaniabutto.com/" target="_blank" rel="noopener noreferrer">Adani Abutto</a></li>
           </ul>
       </div>
   );
};

export default OpenScienceResources;