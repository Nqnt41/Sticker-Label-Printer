import {useEffect, useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';

import {getLabels, removeLabel, checkBackendStatus} from "../ManageLabels";

import './homePage.css';
import '../App.css';

function HomePage( {setData, data, setBackendRunning, backendRunning} ) {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [input, setInput] = useState('');
    const [hover, setHover] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [editIndex, setEditIndex] = useState(-1);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [searchSelected, setSearchSelected] = useState(false);

    const logo = require(`../images/logo.jpg`);

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
        async function fetchData() {
            try {
                setLoading(true);
                await checkBackendStatus();
                const labels = await getLabels();
                setData(labels);
                setLoading(false);
            }
            catch (e) {
                console.error("fetchData - backend not working or online!");
            }
        }

        if (backendRunning) {
            fetchData();
        }
        else {
            setLoading(true);
        }
    }, [backendRunning, setData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setSearchSelected(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading || !backendRunning) {
        return <div className="App">Loading...</div>;
    }
    else {
        return (
            <div className="App">
                <img className="logo" onClick={() => navigate('/')} src={logo} alt={''}/>
                <h1>Sticker Sheet Printer</h1>
                <h2 style={{marginBottom: '0.75rem'}}>Search for existing sticker label:</h2>
                <h3 style={{marginBottom: '0.75rem', fontWeight: 'normal'}}>Select entry (e.g. Chicken Parmigiana) to
                    print.</h3>
                <div>
                    <input
                        ref={inputRef}
                        style={{fontSize: '1rem'}}
                        placeholder="Enter name of food item"
                        onClick={() => setSearchSelected(true)}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    {searchSelected && Array.isArray(data) && data.length > 0 && (
                        <div className="optionsContainer">
                            {data.filter(entry => entry.name.toLowerCase().startsWith(input.toLowerCase())).map((entry, index) => (
                                <div
                                    key={index}
                                    ref={inputRef}
                                    className={`option ${hoverIndex === index && editIndex === -1 && deleteIndex === -1 ? 'hover' : ''}`}
                                    onClick={() => navigate("/print-preview", {state: {label: entry}})}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(-1)}
                                >
                                    <label style={{cursor: 'pointer', flexGrow: 1}}>
                                        <span>{entry.name}</span>
                                    </label>
                                    <button
                                        ref={inputRef}
                                        className={`subButton ${editIndex === index ? 'buttonHover' : ''}`}
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            navigate(`/sticker-creation`, {state: {entry}})
                                        }}
                                        onMouseEnter={() => setEditIndex(index)}
                                        onMouseLeave={() => setEditIndex(-1)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        ref={inputRef}
                                        className={`subButton ${deleteIndex === index ? 'buttonHover' : ''}`}
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            if (checkBackendStatus()) {
                                                removeLabel(entry, setData)
                                            }
                                        }}
                                        onMouseEnter={() => setDeleteIndex(index)}
                                        onMouseLeave={() => setDeleteIndex(-1)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <h3 style={{marginTop: '0.75rem', marginBottom: '0.75rem'}}>Or, add a new sticker sheet:</h3>
                <button
                    className={`bold ${hover ? 'altHover' : ''}`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => navigate(`/sticker-creation`)}
                >
                    Create New Label
                </button>
            </div>
        );
    }
}

export default HomePage;