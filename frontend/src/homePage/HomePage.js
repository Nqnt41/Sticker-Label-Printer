import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';

import {getLabels, removeLabel} from "../ManageLabels";

import './homePage.css';
import '../App.css';

function HomePage( {setData, data} ) {
    const navigate = useNavigate();

    const [input, setInput] = useState('');
    const [hover, setHover] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [editIndex, setEditIndex] = useState(-1);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    const logo = require(`../images/logo.jpg`);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const labels = await getLabels();
            setData(labels);
            setLoading(false);
        }

        fetchData();
    }, [setData]);

    if (loading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className="App">
            <img className="logo" onClick={() => navigate('/')} src={logo} alt={''}/>
            <h1>Sticker Sheet Printer</h1>
            <h2 style={{ marginBottom: '0.75rem' }}>Search for existing sticker label:</h2>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 'normal' }}>Select entry (e.g. Chicken Parmigiana) to print.</h3>
            <div>
                <input
                    style={{ fontSize: '1rem' }}
                    placeholder="Enter name of food item"
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            navigate(`/sticker-creation`);
                        }
                    }}
                />
                {input !== '' && (
                    <div className="optionsContainer">
                        {data.filter(entry => entry.name.toLowerCase().startsWith(input.toLowerCase())).map((entry, index) => (
                            <div
                                key={index}
                                className={`option ${hoverIndex === index && editIndex === -1 && deleteIndex === -1 ? 'hover' : ''}`}
                                onClick={() => navigate(`/sticker-creation`)}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(-1)}
                            >
                                <label style={{ cursor: 'pointer', flexGrow: 1 }}>
                                    <span>{entry.name}</span>
                                </label>
                                <button
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
                                    className={`subButton ${deleteIndex === index ? 'buttonHover' : ''}`}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        removeLabel(entry, setData)
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
            <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Or, add a new sticker sheet:</h3>
            <button
                className={`bold ${hover ? 'altHover' : ''}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate(`/sticker-creation`)}
            >
                Create New Label</button>
        </div>
    );
}

export default HomePage;