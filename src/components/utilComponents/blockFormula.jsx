// BlockFormula.jsx
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const BlockFormula = ({ formula }) => {
  const renderedFormula = katex.renderToString(formula, {
    throwOnError: false,
  });

  return (
    <div
      className="block-formula"
      style={{ display: 'block', margin: '20px 0' }} // Ensure it renders as a block with some space
      dangerouslySetInnerHTML={{ __html: renderedFormula }}
    />
  );
};

export default BlockFormula;
