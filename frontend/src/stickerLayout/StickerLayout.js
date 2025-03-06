import '../App.css';
import './stickerLayout.css';

import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import LabelPreview from "./LabelPreview";
import { addLabel } from "../ManageLabels";

function StickerLayout() {
    const [label, setLabel] = useState(() => {
        const storedLabel = JSON.parse(localStorage.getItem('label'));
        return storedLabel !== null ? storedLabel : {
            name: '',
            amount: 0,
            ingredients: '',
            dateMark: '',
            expiration: '',
            options: [true, true, true],
            printOption: true,
            numPages: -1
        };
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'expiration') {
            const trueDate = value.substring(5) + '-' + value.substring(0, 4);

            setLabel((prevLabel) => ({
                ...prevLabel,
                [name]: trueDate,
            }));
        }
        else if (name === 'amount' || name === 'numPages') {
            setLabel((prevLabel) => ({
                ...prevLabel,
                [name]: parseInt(value, 10) || 0,
            }));
        }
        else {
            setLabel((prevLabel) => ({
                ...prevLabel,
                [name]: value,
            }));
        }
    };

    const handleOptionChange = (printing, index) => {
        if (!printing) {
            setLabel((prevLabel) => ({
                ...prevLabel,
                options: prevLabel.options.map((option, i) =>
                    i === index ? !option : option // Toggle the value at the specific index
                ),
            }));
        }
        else {
            setLabel((prevLabel) => ({
                ...prevLabel,
                printOption: !prevLabel.printOption,
            }));
        }
    };

    useEffect(() => {
        localStorage.setItem('label', JSON.stringify(label));
    }, [label]);

    useEffect(() => {
        if (label.printOption) {
            setLabel((prevLabel) => ({ ...prevLabel, numPages: -1 }));
        }
        else if (label.numPages === -1) {
            setLabel((prevLabel) => ({ ...prevLabel, numPages: 1 }));
        }
    }, [label.printOption, label.numPages]);

    const amounts = [0, 8, 16]; // possible amounts
    const days = ['N/A', 'SU', 'M', 'T', 'W', 'TH', 'F', 'S']; // possible dates
    const values = ['Kimmy\'s', 'Address', 'Phone Number']; // features

    const [amountIndex, setAmountIndex] = useState(0);
    const [amountHoverIndex, setAmountHoverIndex] = useState(-1)

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(-1);

    const [plusHover, setPlusHover] = useState(false);
    const [minusHover, setMinusHover] = useState(false);

    const navigate = useNavigate();
    const logo = require(`../images/logo.jpg`);

    return (
        <div className="App">
            <img className="logo" onClick={() => navigate('/')} src={logo} alt={''}/>
            <h1>Edit Sticker Layout</h1>
            <h2 style={{ marginBottom: 0 }}>Add any information needed for stickers. Use preview to see layout.</h2>

            <div className="headingAlign">
                <h3>(Note that only elements with a red star </h3>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'red' }}>*</h3>
                <h3> are required - the rest can be left blank as desired.)</h3>
            </div>

            <div className="layoutContainer">
                <div className="main">
                    <div className='inputContainer'>
                        <h3>Name</h3>
                        <h3 style={{ color: 'red' }}>*</h3>
                        <h3>:   Kimmy's </h3>
                        <input
                            style={{ fontSize: '1rem' }}
                            name='name'
                            onChange={handleInputChange}
                            value={label.name}
                            placeholder="Enter name of food item."
                        />

                        <h3> Amount: </h3>
                        <h3 style={{ color: 'red' }}>*</h3>
                        <h3>: </h3>
                        <div style={{ display: 'flex', gap: 0 }}>
                            {amounts.map((amount, index) => (
                                <button
                                    className='dateButton'
                                    style={{ backgroundColor: amountIndex === index || amountHoverIndex === index ? 'darkgrey' : 'lightgray'}}
                                    onClick={() => {
                                        setLabel((prevLabel) => ({ ...prevLabel, amount }));
                                        setAmountIndex(index);
                                    }}
                                    onMouseEnter={() => setAmountHoverIndex(index)}
                                    onMouseLeave={() => setAmountHoverIndex(-1)}
                                >
                                    {amount}
                                </button>
                            ))}
                        </div>
                        <h3> oz</h3>
                    </div>

                    <div className='inputContainer'>
                        <h3>Ingredients:</h3>
                        <textarea
                            name='ingredients'
                            onChange={handleInputChange}
                            value={label.ingredients}
                            placeholder="List ingredients as they appear on tag."
                        />
                    </div>

                    <div className='inputContainer'>
                        <h3>Date Mark:</h3>
                        <div style={{ display: 'flex', gap: 0 }}>
                            {days.map((day, index) => (
                                <button
                                    className='dateButton'
                                    style={{ backgroundColor: selectedIndex === index || hoverIndex === index ? 'darkgrey' : 'lightgray'}}
                                    onClick={() => {
                                        setLabel((prevLabel) => ({ ...prevLabel, dateMark: days[index] }));
                                        setSelectedIndex(index); // Update selectedIndex for active button styling
                                    }}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(-1)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        <h3>Expiration:</h3>
                        <input
                            type="date"
                            style={{ fontSize: '1rem', width: '10rem' }}
                            name='expiration'
                            onChange={handleInputChange}
                            value={label.expiration}
                            placeholder="Enter expiration date"/>
                    </div>

                    <div className='inputContainer' style={{ display: 'flex', alignItems: 'center' }}>
                        <h3>Include</h3>
                        <h3 style={{ color: 'red' }}>*</h3>
                        <h3>: </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {label.options.map((option, index) => (
                                <label key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '1.15rem', gap: '0.25rem' }}>
                                    <input
                                        type="checkbox"
                                        className='checkbox'
                                        checked={option}
                                        onChange={() => handleOptionChange(false, index)}
                                    />
                                    {values[index]}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='inputContainer' style={{ display: 'flex', alignItems: 'center' }}>
                        <h3>Store/Print</h3>
                        <h3 style={{ color: 'red' }}>*</h3>
                        <h3>: </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '1.15rem', gap: '0.25rem' }}>
                                <input
                                    type="checkbox"
                                    className='checkbox'
                                    checked={label.printOption}
                                    onChange={() => handleOptionChange(true, -1)}
                                />
                                Show Print Preview Page
                            </label>
                        </div>
                    </div>

                    {!label.printOption && (
                        <div className='inputContainer'>
                            <h3>Number of Pages to Print</h3>
                            <h3 style={{ color: 'red' }}>*</h3>
                            <h3>: </h3>
                            <button
                                className='dateButton'
                                style={{ backgroundColor: minusHover ? 'darkgrey' : 'lightgray'}}
                                onClick={() => {
                                    setLabel((prevLabel) => ({ ...prevLabel, numPages: prevLabel.numPages > 1 ? prevLabel.numPages - 1 : 1 }));
                                }}
                                onMouseEnter={() => setMinusHover(true)}
                                onMouseLeave={() => setMinusHover(false)}
                            >
                                -
                            </button>
                            <h3 style={{fontSize: '1.4rem'}}> {label.numPages} </h3>
                            <button
                                className='dateButton'
                                style={{ backgroundColor: plusHover ? 'darkgrey' : 'lightgray'}}
                                onClick={() => {
                                    setLabel((prevLabel) => ({ ...prevLabel, numPages: prevLabel.numPages + 1 }));
                                }}
                                onMouseEnter={() => setPlusHover(true)}
                                onMouseLeave={() => setPlusHover(false)}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>

                <LabelPreview label={label} border={true}/>
            </div>
            <div>
                <button className="printButton" onClick={async () => {
                    await addLabel(label)
                    navigate("/")
                }}>
                    Add Sticker Sheet to Storage
                </button>
                <button className="printButton" style={{ margin: '0 1rem' }} onClick={() =>
                    navigate("/print-preview")}
                >
                    Only Print Sticker Sheet
                </button>
                <button className="printButton" onClick={async () => {
                    await addLabel(label);
                    navigate("/print-preview");
                }}>
                    Add and Print Sticker Sheet
                </button>
            </div>
        </div>
    );
}

export default StickerLayout;