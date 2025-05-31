import '../App.css';
import './stickerLayout.css';
import '../homePage/homePage.css';

import LabelPreview from "../labelPreview/LabelPreview";
import {SettingsMenu} from '../homePage/SettingsMenu';

import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {addLabel, checkBackendStatus, editLabel} from "../ManageLabels";
import {addLabelSQL, editLabelSQL} from "../ManageLabelsSQL";

function StickerLayout( {setData, setBackendRunning, backendRunning, setSQLInfo, sqlInfo} ) {
    const location = useLocation();
    const labelToEdit = location.state?.entry ?? null;
    const originalLabel = labelToEdit ? JSON.parse(JSON.stringify(labelToEdit)) : null;
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAndSetBackendStatus() {
            setBackendRunning(await checkBackendStatus());
        }

        checkAndSetBackendStatus();

        const interval = setInterval(async () => {
            setBackendRunning(await checkBackendStatus());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!backendRunning) {
            navigate("/");
        }
    }, [backendRunning, navigate]);

    const [label, setLabel] = useState(() => {
        const storedLabel = JSON.parse(localStorage.getItem('label'));

        if (labelToEdit !== null) {
            return labelToEdit;
        }
        else if (storedLabel !== null) {
            return storedLabel;
        }
        else {
            return {
                name: '',
                size: 0,
                ingredients: '',
                mark: '',
                expiration: '',
                options: [true, true, true],
            };
        }
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
        else if (name === 'size') {
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
        setLabel((prevLabel) => ({
            ...prevLabel,
            options: prevLabel.options.map((option, i) =>
                i === index ? !option : option // Toggle the value at the specific index
            ),
        }));
    };

    useEffect(() => {
        localStorage.setItem('label', JSON.stringify(label));
    }, [label]);

    const sizes = [0, 8, 16]; // possible sizes
    const days = ['N/A', 'Today\'s Date', 'SU', 'M', 'T', 'W', 'TH', 'F', 'S']; // possible dates
    const values = ['Kimmy\'s or Joey\'s?', 'Address', 'Phone Number']; // features

    const [sizeIndex, setSizeIndex] = useState(0);
    const [sizeHoverIndex, setSizeHoverIndex] = useState(-1)

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(-1);

    const [openSettings, setOpenSettings] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);

    const [useJSON, setUseJSON] = useState(() => {
        const stored = localStorage.getItem('useJSON');
        return stored !== null ? JSON.parse(stored) : true;
    });
    const [useNewFormat, setUseNewFormat] = useState(() => {
        const stored = localStorage.getItem('useNewFormat');
        return stored !== null ? JSON.parse(stored) : true;
    });

    useEffect(() => {
        localStorage.setItem('useNewFormat', JSON.stringify(useNewFormat));
    }, [useNewFormat]);

    const logo = require(`../images/logo.jpg`);

    if (!backendRunning) {
        return <div className="App">Loading...</div>;
    }
    else {
        return (
            <div className="App">
                <img className="logo" onClick={() => navigate('/')} src={logo} alt={''}/>

                <div className='settingsContainer'>
                    <button
                        className={`settingsButton bold ${settingsHover ? 'altHover' : ''} ${openSettings ? 'select' : ''}`}
                        style={{marginRight: '0.25rem'}}
                        onMouseEnter={() => setSettingsHover(true)}
                        onMouseLeave={() => setSettingsHover(false)}
                        onClick={() => setOpenSettings((prev) => !prev)}
                    >
                        Settings
                    </button>
                    {openSettings  && <SettingsMenu setUseJSON={setUseJSON} useJSON={useJSON} setUseNewFormat={setUseNewFormat} useNewFormat={useNewFormat} setSQLInfo={setSQLInfo} sqlInfo={sqlInfo} settingsChangeable={false}/>}
                </div>

                <h1>Edit Sticker Layout</h1>
                <h2 style={{marginBottom: 0}}>Add any information needed for stickers. Use preview to see layout.</h2>

                <div className="headingAlign">
                    <h3>(Note that only elements with a red star </h3>
                    <h3 style={{fontSize: '2rem', fontWeight: 'bold', color: 'red'}}>*</h3>
                    <h3> are required - the rest can be left blank as desired.)</h3>
                </div>

                <div className="layoutContainer">
                    <div className="main">
                        <div className='inputContainer'>
                            <h3>Name</h3>
                            <h3 style={{color: 'red'}}>*</h3>
                            <h3>: </h3>
                            {label.options[0] ? (<h3 style={{ textAlign: "left", width: "75px" }}>Kimmy's </h3>) : (<h3 style={{ textAlign: "left", width: "75px" }}>Joey's </h3>)}
                            <input
                                style={{fontSize: '1rem'}}
                                name='name'
                                onChange={handleInputChange}
                                value={label.name}
                                placeholder="Enter name of food item."
                            />

                            <h3> Amount: </h3>
                            <h3 style={{color: 'red'}}>*</h3>
                            <h3>: </h3>
                            <div style={{display: 'flex', gap: 0}}>
                                {sizes.map((size, index) => (
                                    <button
                                        className='dateButton'
                                        style={{backgroundColor: sizeIndex === index || sizeHoverIndex === index ? 'darkgrey' : 'lightgray'}}
                                        onClick={() => {
                                            setLabel((prevLabel) => ({...prevLabel, size}));
                                            setSizeIndex(index);
                                        }}
                                        onMouseEnter={() => setSizeHoverIndex(index)}
                                        onMouseLeave={() => setSizeHoverIndex(-1)}
                                    >
                                        {size}
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
                            <div style={{display: 'flex', gap: 0}}>
                                {days.map((day, index) => (
                                    <button
                                        className='dateButton'
                                        style={{backgroundColor: selectedIndex === index || hoverIndex === index ? 'darkgrey' : 'lightgray'}}
                                        onClick={() => {
                                            setLabel((prevLabel) => ({...prevLabel, mark: days[index]}));
                                            setSelectedIndex(index);
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
                                style={{fontSize: '1rem', width: '10rem'}}
                                name='expiration'
                                onChange={handleInputChange}
                                value={label.expiration}
                                placeholder="Enter expiration date"/>
                        </div>

                        <div className='inputContainer' style={{display: 'flex', alignItems: 'center'}}>
                            <h3>Include</h3>
                            <h3 style={{color: 'red'}}>*</h3>
                            <h3>: </h3>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                {label.options.map((option, index) => (
                                    <label key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '1.15rem',
                                        gap: '0.25rem'
                                    }}>
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
                    </div>

                    <LabelPreview label={label} border={true}/>
                </div>
                {labelToEdit === null && (
                    <div>
                        <button className="printButton" onClick={async () => {
                            if (await checkBackendStatus()) {
                                if (!sqlInfo.sqlActive || useJSON) {
                                    await addLabel(label, setData);
                                }
                                else {
                                    await addLabelSQL(label, setData);
                                }
                            }
                            navigate("/");
                        }}>
                            Add Sticker Sheet to Storage
                        </button>
                        <button className="printButton" style={{margin: '0 1rem'}} onClick={() => {
                            navigate("/print-preview", {state: {label}});
                        }}>
                            Only Print Sticker Sheet
                        </button>
                        <button className="printButton" onClick={async () => {
                            if (await checkBackendStatus()) {
                                if (!sqlInfo.sqlActive || useJSON) {
                                    await addLabel(label, setData);
                                }
                                else {
                                    await addLabelSQL(label, setData);
                                }
                            }
                            navigate("/print-preview", {state: {label}});
                        }}>
                            Add and Print Sticker Sheet
                        </button>
                    </div>
                )}
                {labelToEdit !== null && (
                    <div>
                        <button className="printButton" onClick={async () => {
                            if (await checkBackendStatus()) {
                                if (!sqlInfo.sqlActive || useJSON) {
                                    await editLabel(originalLabel, label, setData);
                                }
                                else {
                                    await editLabelSQL(originalLabel, label, setData);
                                }
                            }
                            navigate("/");
                        }}>
                            Save Edited Sticker Sheet
                        </button>
                        <button className="printButton" style={{margin: '0 1rem'}} onClick={() => {
                            navigate("/print-preview", {state: {label}});
                        }}>
                            Only Print Sticker Sheet
                        </button>
                        <button className="printButton" onClick={async () => {
                            if (await checkBackendStatus()) {
                                if (!sqlInfo.sqlActive || useJSON) {
                                    await editLabel(originalLabel, label, setData);
                                }
                                else {
                                    await editLabelSQL(originalLabel, label, setData);
                                }
                            }
                            navigate("/print-preview", {state: {label}});
                        }}>
                            Save Edit and Print Sticker Sheet
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default StickerLayout;