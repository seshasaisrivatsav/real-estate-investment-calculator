import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Calculator from './components/calculator';
import DataAnalysis from './components/DataAnalysis';

function App() {
  return (
    <BrowserRouter basename="/real-estate-investment-calculator">
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;