export async function establishConnectionSQL(hostname, port, dbName, table, user, password) {
    console.log("establishConnection SQL");

    try {
        const response = await fetch("http://localhost:4567/check-sql-connection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hostname, port, dbName, table, user, password })
        })

        const text = await response.text();
        console.log("Response text:", text);

        return response.ok && text === "true";
    }
    catch (error) {
        console.error("Error fetching labels via SQL:", error);
        throw error;
    }
}

export async function getLabelsSQL() {
    console.log("GET");

    try {
        const response = await fetch(`http://localhost:4567/get-sql-labels`, {
            method: "GET",
        });

        return await response.json();
    }
    catch (error) {
        console.error("Error fetching labels:", error);
    }
}

export function addLabelSQL(label, setData) {
    console.log("ADD SQL");

    if (!label) {
        return;
    }

    const { name, size, ingredients, mark, options, expiration } = label;

    const date = new Date();
    const additionDate = date.toLocaleDateString();

    console.log({ name, size, ingredients, mark, options, expiration, additionDate });

    fetch("http://localhost:4567/add-sql-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, size, ingredients, mark, options, expiration, additionDate })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("add-sql-label: Function failed to add label")
            }
            return response.json();
        })
        .then(() => {
            console.log("ADD - DATA: ", label);

            setData(prevData => {
                console.log("prevData is", prevData);
                console.log("label is", label);
                return [...prevData, label]
            });
        })
        .catch(error => console.error("Error adding label:", error));
}

export function removeLabelSQL(label, setData) {
    console.log("REMOVE SQL");

    const name = label.name;
    const size = parseInt(label.size);

    fetch(`http://localhost:4567/delete-sql-label?name=${encodeURIComponent(name)}&size=${size}`, {
        method: "DELETE",
    })
        .then(response => response.text())
        .then(data => {
            setData(prevData => prevData.filter(entry => entry.name !== label.name || entry.size !== label.size));
            console.log(data)
        })
        .catch(error => console.error("Error deleting label:", error));
}

export function editLabelSQL(originalLabel, newLabel, setData) {
    console.log("EDIT", originalLabel, newLabel);

    fetch(`http://localhost:4567/edit-sql-label`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalLabel, newLabel })
    })
        .then(response => response.text())
        .then(newEntry => {
            console.log("updating...", originalLabel, newLabel);
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