import { isEqual } from "lodash";

export async function getLabels() {
    console.log("GET");

    try {
        const response = await fetch(`http://localhost:4567/get-labels`, {
            method: "GET",
        });
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching labels:", error);
        throw error;
    }
}

export function addLabel(label, setData) {
    console.log("ADD");

    if (!label) {
        return;
    }

    const { name, size, ingredients, mark, options, expiration, inclusions } = label;

    console.log("TEST " + size);

    const date = new Date();
    const additionDate = date.toLocaleDateString();

    console.log({ name, size, ingredients, mark, options, expiration, additionDate, inclusions });

    fetch("http://localhost:4567/add-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, size, ingredients, mark, options, expiration, additionDate, inclusions })
    })
        .then(response => response.text())
        .then(data => {
            setData(prevData => [...prevData, data])
            console.log(data);
        })
        .catch(error => console.error("Error adding label:", error));
}

export function removeLabel(label, setData) {
    console.log("REMOVE");

    const name = label.name;
    const size = parseInt(label.size);

    fetch(`http://localhost:4567/delete-label?name=${encodeURIComponent(name)}&size=${size}`, {
        method: "DELETE",
    })
        .then(response => response.text())
        .then(data => {
            setData(prevData => prevData.filter(entry => entry.name !== label.name || entry.size !== label.size));
            console.log(data)
        })
        .catch(error => console.error("Error deleting label:", error));
}

export function editLabel(originalLabel, newLabel, setData) {
    console.log("EDIT");

    fetch(`http://localhost:4567/edit-label`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalLabel, newLabel })
    })
        .then(response => response.json())
        .then(newEntry => {
            setData(prevData => prevData.map(entry => (entry.name === originalLabel.name && entry.size === originalLabel.size) ? newEntry : entry));
        })
        .catch(error => console.error("Error editing label:", error));
}

export async function checkBackendStatus() {
    try {
        await fetch('http://localhost:4567', { mode: 'no-cors' });
        return true;
    } catch (error) {
        return false;
    }
}