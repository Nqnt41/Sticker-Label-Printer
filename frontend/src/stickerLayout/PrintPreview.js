import '../App.css';
import './stickerLayout.css'
import './printPreview.css';
import LabelPreview from './LabelPreview';

import { useReactToPrint } from 'react-to-print';
import React, { useEffect, useRef } from 'react';
import {useLocation, useNavigate} from "react-router-dom";

export function PrintPreview() {
    const navigate = useNavigate();

    const location = useLocation();
    const label = location.state?.label;

    if (label === null) {
        navigate("/");
    }

    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: 'Sticker Printout',
        contentRef: contentRef,
        onAfterPrint: () => navigate("/"),
    })

    useEffect(() => {
        handlePrint();
    }, [handlePrint]);

    return (
        <div>
            <div ref={contentRef} className="printerPageSize">
                <div className="labelGrid">
                    {Array.from({length: 15}).map((_, index) => (
                        <LabelPreview key={index} label={label} border={false}/>
                    ))}
                </div>
            </div>
        </div>
    );
}