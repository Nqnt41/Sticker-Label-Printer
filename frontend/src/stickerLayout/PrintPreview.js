import '../App.css';
import './stickerLayout.css'
import './printPreview.css';
import LabelPreview from './LabelPreview';

import { useReactToPrint } from 'react-to-print';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

export function PrintPreview({ label }) {
    if (label == null) {
        label = {
            name: 'Chicken Parmigiana',
            amount: 16,
            ingredients: 'Pork Sausage, Marinara Sauce (plum tomatoes, onions, garlic, parsley, basil), romano cheese (milk, salt, starch, enzymes) parmigiana cheese',
            dateMark: '',
            expiration: '12-2-2222',
            options: [true, true, true],
            printOption: true,
            numPages: -1
        };
    }

    const navigate = useNavigate();

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