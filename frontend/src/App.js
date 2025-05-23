import React, {useEffect, useState} from "react";
import {HashRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import './App.css';
import HomePage from "./homePage/HomePage";
import StickerLayout from "./stickerLayout/StickerLayout";
import { PrintPreview } from "./printPreview/PrintPreview";
import { ShowLabels } from "./showLabels/ShowLabels";

function App() {
    const [data, setData] = useState([]);
    const [backendRunning, setBackendRunning] = useState(false);

    return (
        <Router basename="/">
            <PageTracker/>
            <Routes>
                <Route path="/" element={<HomePage setData={setData} data={data} setBackendRunning={setBackendRunning} backendRunning={backendRunning} />} />
                <Route path="/sticker-creation" element={<StickerLayout setData={setData} setBackendRunning={setBackendRunning} backendRunning={backendRunning} />} />
                <Route path="/print-preview" element={<PrintPreview />} />
                <Route path="/show-labels" element={<ShowLabels setData={setData} data={data}/>} />
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