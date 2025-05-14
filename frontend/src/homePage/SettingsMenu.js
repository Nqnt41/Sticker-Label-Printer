import {useState} from "react";

export function SettingsMenu( {setUseJSON, useJSON, setUseNewFormat, useNewFormat} ) {
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);
    const [hover3, setHover3] = useState(false);
    const [hover4, setHover4] = useState(false);

    return (
        <div className='settingsMenu'>
            <div style={{marginBottom: '0.5rem'}}>
                <h3 style={{marginTop: '0', marginBottom: '0.25rem'}}>Select sticker sheet format:</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>4x4: The format used for the newer sticker sheets.</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem", marginBottom: "0.5rem"}}>5x3: The format used for the old sticker sheets.</h3>
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

            <div>
                <h3>Select Database Type:</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>WIP - MySQL use still under development!</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>JSON: Uses simple text file to store data.</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem", marginBottom: "0.5rem"}}>MySQL: Uses a data management program.</h3>
                <button
                    onClick={() => setUseJSON(true)}
                    className={`bold ${hover3 ? 'altHover' : ''} ${useJSON ? 'select' : ''}`}
                    style={{marginRight: '0.25rem'}}
                    onMouseEnter={() => setHover3(true)}
                    onMouseLeave={() => setHover3(false)}
                >
                    JSON
                </button>
                <button
                    onClick={() => setUseJSON(false)}
                    className={`bold ${hover4 ? 'altHover' : ''} ${useJSON ? '' : 'select'}`}
                    onMouseEnter={() => setHover4(true)}
                    onMouseLeave={() => setHover4(false)}
                >
                    MySQL
                </button>
            </div>
        </div>
    );
}