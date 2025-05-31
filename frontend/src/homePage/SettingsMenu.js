import React, {useEffect, useState} from "react";
import Popup from 'reactjs-popup';
import YouTube from "react-youtube";
import {establishConnectionSQL} from "../ManageLabelsSQL";

export function SettingsMenu( {setUseJSON, useJSON, setUseNewFormat, useNewFormat, setSQLInfo, sqlInfo, settingsChangeable, dbSynced, setDBSynced} ) {
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);

    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className={`settingsMenu ${showPopup ? 'none' : ''}`}>
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

            { settingsChangeable ? <SelectDatabaseType setUseJSON={setUseJSON} useJSON={useJSON} setSQLInfo={setSQLInfo}
                                                       sqlInfo={sqlInfo} showPopup={showPopup} setShowPopup={setShowPopup}
                                                       dbSynced={dbSynced} setDBSynced={setDBSynced} />
                : <div>
                    <h3>Database settings cannot be changed during sticker creation!</h3>
                    <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>Current database type: {useJSON ? <>JSON</> : <>MySQL</>}.</h3>
                    <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>{dbSynced ? <>Databases are currently synced.</> : <>Databases are not currently synced.</>}</h3>
                </div>
            }
        </div>
    );
}

function SelectDatabaseType ( {setUseJSON, useJSON, setSQLInfo, sqlInfo, showPopup, setShowPopup, dbSynced, setDBSynced} ) {
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);
    const [hover3, setHover3] = useState(false);

    return (
        <div>
            <div style={{marginBottom: '0.5rem'}}>
                <h3>Select Database Type:</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>JSON: Uses simple text file to store data.</h3>
                <h3 style={{fontWeight: "normal", fontSize: "1rem", marginBottom: "0.5rem"}}>MySQL: Uses a data management program.</h3>
                <button
                    onClick={() => {
                        setUseJSON(true);
                        localStorage.setItem('useJSON', JSON.stringify(true));
                    }}
                    className={`bold ${hover1 ? 'altHover' : ''} ${useJSON ? 'select' : ''}`}
                    style={{marginRight: '0.25rem'}}
                    onMouseEnter={() => setHover1(true)}
                    onMouseLeave={() => setHover1(false)}
                >
                    JSON
                </button>
                <button
                    onClick={() => {
                        if (sqlInfo.sqlActive) {
                            setUseJSON(false);
                            localStorage.setItem('useJSON', JSON.stringify(false));
                        }
                        else {
                            setShowPopup(true);
                        }
                    }}
                    className={`bold ${hover2 ? 'altHover' : ''} ${useJSON ? '' : 'select'}`}
                    onMouseEnter={() => setHover2(true)}
                    onMouseLeave={() => setHover2(false)}
                >
                    {sqlInfo.sqlActive ? 'MySQL' : 'Set Up MySQL'}
                </button>

                <SQLSetupMenu setSQLInfo={setSQLInfo} showPopup={showPopup} setShowPopup={setShowPopup} setUseJSON={setUseJSON} useJSON={useJSON}/>
            </div>

            {/* TODO: sqlInfo.sqlActive &&
                <div style={{marginBottom: '0.5rem'}}>
                    <h3>Sync JSON and MySQL Databases:</h3>
                    <h3 style={{fontWeight: "normal", fontSize: "1rem"}}>If active, the two databases share their data.</h3>
                    <h3 style={{fontWeight: "normal", fontSize: "1rem", marginBottom: "0.5rem"}}>Otherwise, they will have different information.</h3>
                    <button
                        onClick={() => {
                            if (dbSynced) {
                                setDBSynced(false);
                            }
                            else {
                                setDBSynced(true);
                                <SyncSetupMenu/>
                            }
                        }}
                        className={`bold ${hover3 ? 'altHover' : ''} ${useJSON ? 'select' : ''}`}
                        style={{marginRight: '0.25rem'}}
                        onMouseEnter={() => setHover3(true)}
                        onMouseLeave={() => setHover3(false)}
                    >
                        {dbSynced ? "Disconnect Databases" : "Connect Databases"}
                    </button>
                </div>
            */}
        </div>
    );
}

function SQLSetupMenu ( {setSQLInfo, showPopup, setShowPopup, setUseJSON, useJSON} ) {
    const [url, setURL] = useState("");

    const [hostname, setHostname] = useState("");
    const [port, setPort] = useState("");
    const [dbName, setDBName] = useState("");
    const [tableName, setTableName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function attemptConnection() {
        let connectionFound = await establishConnectionSQL(hostname, port, dbName, tableName, username, password)

        console.log("CONNECTIONFOUND " + connectionFound);

        if (connectionFound) {
            const info = {
                sqlActive: true,
                url: "jdbc:mysql://" + hostname + ":" + port + "/" + dbName,
                table: tableName,
                user: username,
                password: password
            };
            setSQLInfo(info);
            setUseJSON(false);
            setShowPopup(false);

            localStorage.setItem("sqlInfo", JSON.stringify(info));
            localStorage.setItem('useJSON', JSON.stringify(false));
        }
        else {
            resetPopup();
            alert('The inputted info was not correct!');
        }
    }

    function resetPopup() {
        setHostname("");
        setPort("");
        setDBName("");
        setTableName("");
        setUsername("");
        setPassword("");
    }

    useEffect(() => {
        setURL("jdbc:mysql://" + hostname + ":" + port + "/" + dbName);
    }, [hostname, port, dbName]);

    return (
        <Popup open={showPopup} onClose={() => resetPopup()}>
            <div className='popupMenu'>
                <h2 style={{marginTop: '0', marginBottom: '0.5rem'}}>Follow the instructions below to set up the MySQL database for this project.</h2>
                <ol>
                    <li>
                        <h3>Downloading MySQL:</h3>
                        <div>The following YouTube tutorial can be used to help you download MySQL, if it is not already installed. Please follow this tutorial to completion, and keep MySQL Workbench open once its done.</div>
                        <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>When setting up your server connection via the MySQL Workbench, please note the Hostname, Port, Username, and Password used to create the server.</div>
                        <MovieClip/>
                    </li>

                    <li>
                        <h3 style={{marginTop: '0.5rem'}}>Creating the MySQL Database:</h3>
                        <div>Next, we will use MySQL Workbench and the prompts below to make the database used for the project.</div>
                        <div>Copy and paste the following command into the Workbench. <span style={{fontWeight: 'bold'}}>StickerPrinter is a default database name - any name can be chosen if desired.</span>:
                                <pre style={{fontWeight: 'bold', fontSize: '1rem'}}>{`CREATE DATABASE StickerPrinter;`}</pre>
                                <div>If the output shows "Query OK, 0 rows affected...", then the query was successful.</div>
                        </div>
                    </li>

                    <li>
                        <h3>Adding Server Information to the Program:</h3>
                        <div>Now, we will use the information from the database we just made in order to connect this program to the database.</div>
                        <div>Please fill the fields below with the information from the database that was just made for this project.</div>
                        <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>If you need to check what the information for any of these fields are, input the commands/instructions in parenthesis into the MySQL Workbench server.</div>
                        <h3>
                            Current URL: <span style={{fontWeight: 'normal'}}>{url}</span>
                        </h3>
                        <h3>
                            Current Table Name: <span style={{fontWeight: 'normal'}}>{tableName}</span>
                        </h3>
                        <h3>
                            Current Username: <span style={{fontWeight: 'normal'}}>{username}</span>
                        </h3>
                        <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
                            Current Password: <span style={{fontWeight: 'normal'}}>{password}</span>
                        </h3>

                        <h3>Host Name: </h3>
                        <div>(SELECT HOST FROM INFORMATION_SCHEMA.PROCESSLIST; - host name is on the left side of the result.)</div>
                        <div>(e.g. if result is localhost:52659, the host name is localhost.) </div>
                        <input
                            style={{fontSize: '1rem', fontWeight: 'normal'}}
                            name='name'
                            value={hostname}
                            onChange={(e) => setHostname(e.target.value)}
                            placeholder="Enter the host name used to set up MySQL. (e.g. localhost)"
                        />
                        <h3>Port: </h3>
                        <div>(SHOW GLOBAL VARIABLES LIKE 'PORT';)</div>
                        <input
                            style={{fontSize: '1rem', fontWeight: 'normal'}}
                            name='port'
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            placeholder="Enter the port set for MySQL. (e.g. 3000)"
                        />
                        <h3>Database Name: </h3>
                        <div>(SELECT DATABASE;)</div>
                        <input
                            style={{fontSize: '1rem'}}
                            name='dbName'
                            value={dbName}
                            onChange={(e) => setDBName(e.target.value)}
                            placeholder="Enter the name of the MySQL database. (e.g. StickerPrinter)"
                        />
                        <h3>Table Name: </h3>
                        <div>(SELECT TABLE;)</div>
                        <input
                            style={{fontSize: '1rem'}}
                            name='table'
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Enter the name of the table from the database. (e.g. Labels)"
                        />
                        <h3>Username: </h3>
                        <div>(SELECT USER;)</div>
                        <input
                            style={{fontSize: '1rem'}}
                            name='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter the username for the MySQL database. (e.g. root)"
                        />
                        <h3>Password: </h3>
                        <div>(Reset password via: USE 'database_name'; UPDATE 'database_name'.user SET authentication_string=PASSWORD('new_password') WHERE User='username';)</div>
                        <input
                            style={{fontSize: '1rem'}}
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter the password for the MySQL database. (e.g. password)"
                        /> <br/>
                        <button
                            style={{fontWeight: 'bold', marginTop: '1rem'}}
                            onClick={() => attemptConnection()}
                        >
                            Establish Connection
                        </button>
                        {/*"127.0.0.1", "3306", "TESTSTICKERS", "Labels", "root", ""*/}
                    </li>
                </ol>
            </div>
        </Popup>
    )
}


class MovieClip extends React.Component {
    render() {
        const options = {
            height: '315',
            width: '560',
            playerVars: {
                autoplay: 1,
                controls: 1,
            },
        };

        return <YouTube videoId="u96rVINbAUI?si=HF991jQS3hKj-e2i" options={options} onReady={this._onReady} id="video"/>;
    }

    _onReady(event) {
        event.target.pauseVideo();
    }
}