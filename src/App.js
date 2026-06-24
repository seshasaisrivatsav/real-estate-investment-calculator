import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/header';
import Calculator from './components/calculator';
import DataAnalysis from './components/DataAnalysis';
import RoiCalculator from './components/roiCalculator/RoiCalculator';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ErrorBoundary>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/data-analysis" element={<DataAnalysis />} />
                <Route path="/roi-calculator" element={<RoiCalculator />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
