// InlineFormula.jsx
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const InlineFormula = ({ formula }) => {
  const renderedFormula = katex.renderToString(formula, {
    throwOnError: false,
  });

  return (
    <span
      className="inline-formula"
      dangerouslySetInnerHTML={{ __html: renderedFormula }}
    />
  );
};

export default InlineFormula;
