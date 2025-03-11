import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import './App.css';
import HomePage from "./homePage/HomePage";
import StickerLayout from "./stickerLayout/StickerLayout";
import { PrintPreview } from "./stickerLayout/PrintPreview";

/*import {exec, spawn} from "node:child_process";
const util = require('util');
const execPromise = util.promisify(exec);*/

function App() {
    const [data, setData] = useState([]);
    const [backendRunning, setBackendRunning] = useState(false);

    /*if (process.env.NEXT_RUNTIME === 'nodejs') {
        useEffect(async () => {
            await runBackend('/target/stickerPrinterBackend-1.0-SNAPSHOT.jar');
        }, []);
    }*/

    return (
        <Router basename="/">
            <PageTracker/>
            <Routes>
                <Route path="/" element={<HomePage setData={setData} data={data} setBackendRunning={setBackendRunning} backendRunning={backendRunning} />} />
                <Route path="/sticker-creation" element={<StickerLayout setData={setData} setBackendRunning={setBackendRunning} backendRunning={backendRunning} />} />
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

/*async function runBackend(jarPath) {
    try {
        const {stdout, stderr} = await execPromise(`java -jar ${jarPath}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    }
    catch (e) {
        console.error(`runBackend - Error running backend via ${jarPath}`);
    }
}*/

export default App;