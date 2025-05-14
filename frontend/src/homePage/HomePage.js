import {useEffect, useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';

import {getLabels, removeLabel, checkBackendStatus} from "../ManageLabels";

import './homePage.css';
import '../App.css';

function SelectFormat( {setUseNewFormat, useNewFormat} ) {
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);

    return (
        <div>
            <h2 style={{marginBottom: '0.25rem'}}>Select sticker sheet format:</h2>
            <h3 style={{fontWeight: 'normal'}}>4x4: The format used for the newer sticker sheets.</h3>
            <h3 style={{fontWeight: 'normal', marginBottom: '0.5rem'}}>5x3: The format used for the old sticker sheets.</h3>
            <button
                onClick={() => setUseNewFormat(true)}
                className={`bold ${hover1 ? 'altHover' : ''} ${useNewFormat ? 'select' : ''}`}
                style={{marginRight: '0.25rem'}}
                onMouseEnter={() => setHover1(true)}
                onMouseLeave={() => setHover1(false)}
            >
                4x4
            </button>
            <button
                onClick={() => setUseNewFormat(false)}
                className={`bold ${hover2 ? 'altHover' : ''} ${useNewFormat ? '' : 'select'}`}
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
            >
                5x3
            </button>
        </div>
    );
}

function UseJSONComponent( {setUseJSON, useJSON} ) {
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);

    return (
        <div className='jsonSelection'>
            <h3>Select Database Type:</h3>
            <h3 style={{fontWeight: "normal", fontSize: "1rem", marginBottom: "0.25rem"}}>(WIP: For developer use only!)</h3>
            <button
                onClick={() => setUseJSON(true)}
                className={`bold ${hover1 ? 'altHover' : ''} ${useJSON ? 'select' : ''}`}
                style={{marginRight: '0.25rem'}}
                onMouseEnter={() => setHover1(true)}
                onMouseLeave={() => setHover1(false)}
            >
                JSON
            </button>
            <button
                onClick={() => setUseJSON(false)}
                className={`bold ${hover2 ? 'altHover' : ''} ${useJSON ? '' : 'select'}`}
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
            >
                MySQL
            </button>
        </div>
    );
}

function HomePage( {setData, data, setBackendRunning, backendRunning} ) {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [input, setInput] = useState('');
    const [hover, setHover] = useState(false);
    const [showLabelsHover, setShowLabelsHover] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [editIndex, setEditIndex] = useState(-1);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [searchSelected, setSearchSelected] = useState(false);
    const [useJSON, setUseJSON] = useState(true);
    const [useNewFormat, setUseNewFormat] = useState(() => {
        const stored = localStorage.getItem('useNewFormat');
        return stored !== null ? JSON.parse(stored) : true;
    });

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
                setData(labels || []);
                setLoading(false);
            } catch (e) {
                console.error("fetchData - backend not working or online!", e);
                setData([]);
                setLoading(false);
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

    useEffect(() => {
        localStorage.setItem('labelData', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        localStorage.setItem('useNewFormat', JSON.stringify(useNewFormat));
    }, [useNewFormat]);

    if (loading || !backendRunning) {
        return <div className="App">Loading...</div>;
    }
    else {
        return (
            <div className="App">
                <img className="logo" onClick={() => navigate('/')} src={logo} alt={''}/>
                <h1>Sticker Sheet Printer</h1>

                <SelectFormat setUseNewFormat={setUseNewFormat} useNewFormat={useNewFormat}/>

                <h2 style={{marginBottom: '0.75rem'}}>Search for existing sticker label:</h2>
                <h3 style={{marginBottom: '0.75rem', fontWeight: 'normal'}}>Select entry (e.g. Chicken Parmigiana) to print.</h3>

                <div ref={inputRef}>
                    <input
                        style={{fontSize: '1rem'}}
                        placeholder="Enter name of food item"
                        onClick={() => setSearchSelected(true)}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    {searchSelected && Array.isArray(data) && data.length > 0 && (
                        <div className="optionsContainer">
                            {data
                                .filter(entry => entry.name.toLowerCase().startsWith(input.toLowerCase()))
                                .map((entry, index) => (
                                    <div
                                        key={index}
                                        className={`option ${hoverIndex === index && editIndex === -1 && deleteIndex === -1 ? 'hover' : ''}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            navigate("/print-preview", { state: { label: entry } });
                                            console.log(entry?.name);
                                        }}
                                        onMouseEnter={() => setHoverIndex(index)}
                                        onMouseLeave={() => setHoverIndex(-1)}
                                    >
                                        <label style={{ cursor: 'pointer', flexGrow: 1 }}>
                                            <span>{`${entry?.name}${entry?.size && entry?.size > 0 ? ` (${entry.size} oz)` : ''}` || ""}</span>
                                        </label>
                                        <button
                                            className={`subButton ${editIndex === index ? 'buttonHover' : ''}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/sticker-creation`, { state: { entry } });
                                            }}
                                            onMouseEnter={() => setEditIndex(index)}
                                            onMouseLeave={() => setEditIndex(-1)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`subButton ${deleteIndex === index ? 'buttonHover' : ''}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                if (checkBackendStatus()) {
                                                    removeLabel(entry, setData);
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

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', }}>
                    <div>
                        <h3 style={{marginTop: '1rem', marginBottom: '0.75rem'}}>Add a new sticker sheet:</h3>
                        <button
                            className={`bold ${hover ? 'altHover' : ''}`}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            onClick={() => navigate(`/sticker-creation`)}
                        >
                            Create New Label
                        </button>
                    </div>

                    <div>
                        <h3 style={{marginTop: '1rem', marginBottom: '0.75rem'}}>Display all created labels:</h3>
                        <button
                            className={`bold ${showLabelsHover ? 'altHover' : ''}`}
                            onMouseEnter={() => setShowLabelsHover(true)}
                            onMouseLeave={() => setShowLabelsHover(false)}
                            onClick={() => navigate(`/show-labels`)}
                        >
                            Display All Labels
                        </button>
                    </div>
                </div>

                {/*<UseJSONComponent setUseJSON={setUseJSON} useJSON={useJSON}/>*/}
            </div>
        );
    }
}

export default HomePage;