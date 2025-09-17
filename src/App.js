import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Calculator from './components/calculator';
import DataAnalysis from './components/DataAnalysis';
import RoiCalculator from './components/roiCalculator/RoiCalculator';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/roi-calculator" element={<RoiCalculator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
