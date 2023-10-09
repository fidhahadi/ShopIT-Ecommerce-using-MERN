
import './App.css';
import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/Home';
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>

      <Header />
      <div className="container container-fluid">
        <Toaster position='top-center' />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
