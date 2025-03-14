import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const BlockFormula = ({ formula }) => {
  const renderedFormula = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: true, // Render as block-level math
  });

  return (
    <div
      className="block-formula"
      style={{ display: 'block', margin: '20px 0', textAlign: 'center' }} // Center the formula
      dangerouslySetInnerHTML={{ __html: renderedFormula }}
    />
  );
};

export default BlockFormula;