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
    const [sqlInfo, setSQLInfo] = useState(() => {
        try {
            const stored = localStorage.getItem('sqlInfo');
            console.log("STORED " + stored);

            /* if (stored) {
                const urlA = JSON.parse(stored).url;
                const colonIndex = urlA.indexOf(':', 14);
                const slashIndex = urlA.indexOf('/', 15);

                console.log(urlA.substring(0, 13) + " " + urlA.substring(13, colonIndex) + " " + urlA.substring(colonIndex + 1, slashIndex) + " " + urlA.substring(slashIndex + 1, urlA.length ));
            }*/

            return stored ? JSON.parse(stored) : {
                sqlActive: false,
                url: "",
                table: "",
                user: "",
                password: "",
            };
        }
        catch (e) {
            console.warn("Could not parse localStorage sqlInfo:", e);
            return {
                sqlActive: false,
                url: "",
                table: "",
                user: "",
                password: "",
            };
        }
    });

    return (
        <Router basename="/">
            <PageTracker/>
            <Routes>
                <Route path="/" element={<HomePage setData={setData} data={data}
                                                   setBackendRunning={setBackendRunning} backendRunning={backendRunning}
                                                   setSQLInfo={setSQLInfo} sqlInfo={sqlInfo} />} />
                <Route path="/sticker-creation" element={<StickerLayout setData={setData}
                                                                        setBackendRunning={setBackendRunning} backendRunning={backendRunning}
                                                                        setSQLInfo={setSQLInfo} sqlInfo={sqlInfo} />} />
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