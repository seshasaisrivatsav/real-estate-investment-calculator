// InlineFormula.jsx
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const InlineFormula = ({ formula }) => {
  let renderedFormula;
  try {
    renderedFormula = katex.renderToString(formula, {
      throwOnError: false,
      displayMode: false, // Ensure inline rendering
    });
  } catch (error) {
    console.error("Error rendering formula:", error);
    renderedFormula = formula; // Fallback to raw formula text
  }

  return (
    <span
      className="inline-formula"
      dangerouslySetInnerHTML={{ __html: renderedFormula }}
    />
  );
};

export default InlineFormula;
