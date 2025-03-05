import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import './App.css';
import HomePage from "./homePage/HomePage";
import StickerLayout from "./stickerLayout/StickerLayout";
import { PrintPreview } from "./stickerLayout/PrintPreview";

function App() {
  return (
      <Router basename="/">
        <PageTracker/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sticker-creation" element={<StickerLayout />} />
          <Route path="/print-preview" element={<PrintPreview />} />
        </Routes>
      </Router>
  );
}

function PageTracker() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            localStorage.setItem('label', JSON.stringify(null));
        }
    }, [location.pathname]);
}

export default App;