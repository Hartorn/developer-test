import { useState, useEffect } from 'react';


function ConfigurationDisplay({ targetUrl }) {
    const [config, setConfig] = useState();
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
                setConfig(data);
                setError(undefined);
            })
            .catch((error) => {
                setConfig(undefined);
                setError(error)
            });
    }
    useEffect(fetchConfig, [targetUrl]);
    return (
        <div>
            <h2>Configuration </h2>
            {config && <>
                <p>Spaceship autonomy: {config.autonomy}</p>
                <p>Departure: {config.departure}</p>
                <p>Arrival: {config.arrival}</p>
            </>}
            {error && <>
                <p>Could not fetch routes, please refresh the page and/or check the server: {error}</p>
            </>}
        </div>
    );
}

export default ConfigurationDisplay;
