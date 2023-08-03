import "./Routes.css"

import { useState, useEffect } from 'react';

function SimpleRoute({ start, dests }) {
    return <li>
        <p>From: {start}</p>
        <p>To:</p >
        <ul>
            {Object.entries(dests).map(([dest, value], index) => <li key={index}>{dest} {value}</li>)}
        </ul>
    </li >
}

function RoutesDisplay({ targetUrl }) {
    const [isHidden, setHidden] = useState(true);
    const [routes, setRoutes] = useState();
    const [error, setError] = useState();

    const fetchConfig = () => {
        fetch(targetUrl, {
            method: 'GET',
            headers: {
                'content-type': "application/json",
            },
        })
            .then(res => res.status == 200 ? res.json() : res.text().then((err) => Promise.reject(err)))
            .then((data) => {
                setRoutes(data);
                setError(undefined);
            })
            .catch((error) => {
                setRoutes(undefined);
                setError(error)
            });
    }
    useEffect(fetchConfig, [targetUrl]);
    return (
        <div>
            <h2>Universe (debug)</h2>
            <button onClick={() => setHidden(!isHidden)}>{isHidden ? "Show" : "Hide"}</button>
            {routes && <ul hidden={isHidden}>
                {Object.entries(routes).map(([start, dests], index) => <SimpleRoute start={start} dests={dests} key={index} />)}
            </ul>}
            {error && <>
                <p>Could not fetch routes, please refresh the page and/or check the server: {error}</p>
            </>}
        </div>
    );
}

export default RoutesDisplay;
