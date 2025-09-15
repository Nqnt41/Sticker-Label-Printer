import '../App.css';
import '../stickerLayout/stickerLayout.css'
import '../printPreview/printPreview.css';
import LabelPreview from '../labelPreview/LabelPreview';

import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

export function ShowLabels( {setData, data} ) {
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem('labelData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    return (
        <div className="App">
            <h2 style={{marginTop: '1rem', marginBottom: '0.75rem'}}>All Sticker Labels:</h2>
            <h3 style={{marginBottom: '0.75rem', fontWeight: 'normal'}}>Click on a label to print it out!</h3>

            <div className="displayGrid">
                {data.map((label, index) => (
                    <LabelPreview key={index} label={label} border={true} allowNavigate={true}/>
                ))}
            </div>

            <h2 style={{marginTop: '1rem', marginBottom: '0.75rem'}}>Return to project homepage:</h2>
            <button
                className={`bold ${hover ? 'altHover' : ''}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate("/")}
            >
                Return to Homepage
            </button>
        </div>
    );
}