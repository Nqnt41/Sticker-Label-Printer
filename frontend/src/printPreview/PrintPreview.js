import '../App.css';
import './printPreview.css';

import {LabelPreview} from "../labelPreview/LabelPreview";

import { useReactToPrint } from 'react-to-print';
import React, {useEffect, useRef} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

export function PrintPreview() {
    const navigate = useNavigate();

    const location = useLocation();
    const label = location.state?.label;
    const useNewFormat = JSON.parse(localStorage.getItem('useNewFormat'));

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
        injectPageStyle(useNewFormat ? "letter landscape" : "letter");
        handlePrint();
    }, [handlePrint]);

    return (
        <span>
            <div ref={contentRef} className="printerPageSize">
                <div className={`${useNewFormat ? 'lsLabelGrid' : 'labelGrid'}`}>
                    {Array.from({length: useNewFormat ? 16 : 15}).map((_, index) => (
                        <LabelPreview key={index} label={label} border={false}/> // TODO: change formats based on useNewFormat
                    ))}
                </div>
            </div>
        </span>
    );
}

function injectPageStyle(size) {
    const existing = document.getElementById("dynamic-print-style");
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = "dynamic-print-style";
    style.type = "text/css";
    style.media = "print";

    style.appendChild(document.createTextNode(`
        @page {
            size: ${size};
            margin: ${size === 'letter landscape' ? '0.25in 0.375in' : '0.5in 0.15in'};
            padding: 0;
        }
    `));
    document.head.appendChild(style);
}