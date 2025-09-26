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

    const { name, size, ingredients, mark, options, expiration } = label;

    const date = new Date();
    const additionDate = date.toLocaleDateString();

    const newLabel = {name, size, ingredients, mark, expiration, options}

    fetch("http://localhost:4567/add-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, size, ingredients, mark, options, expiration, additionDate })
    })
        .then(response => response.text())
        .then(data => {
            console.log("new data:", data);
            setData(prevData => [...prevData, newLabel].sort((a, b) => a.name.localeCompare(b.name)));
            console.log("data: " + data);
        })
        .catch(error => console.error("Error adding label:", error));
}

export function removeLabel(label, setData) {
    console.log("REMOVE", label);

    function checkOptions (a, b) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a !== b) {
                return false;
            }
        }

        return true;
    }

    const name = label.name;
    const size = parseInt(label.size);

    fetch(`http://localhost:4567/delete-label?name=${encodeURIComponent(name)}&size=${size}`, {
        method: "DELETE",
    })
        .then(response => response.text())
        .then(data => {
            setData(prevData => prevData.filter(entry => {
                return !dataConditions(entry, label);
            }));
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
        .then(() => {
            setData(prevData => prevData.map(entry => (dataConditions(entry, originalLabel)) ? newLabel : entry));
        })
        .catch(error => console.error("Error editing label:", error));
}

function dataConditions(entry, label) {
    function checkOptions (a, b) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a !== b) {
                return false;
            }
        }

        return true;
    }

    return (entry.name === label.name && entry.size === label.size && entry.ingredients === label.ingredients &&
        entry.mark === label.mark && entry.expiration === label.expiration && entry.additionDate === label.additionDate &&
        checkOptions(entry.options, label.options));
}

export async function checkBackendStatus() {
    try {
        await fetch('http://localhost:4567', { mode: 'no-cors' });
        return true;
    }
    catch (error) {
        return false;
    }
}