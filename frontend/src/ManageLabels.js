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

export function addLabel(label) {
    console.log("ADD");

    if (!label) {
        return;
    }

    const { name, size, ingredients, mark, expiration, inclusions } = label;

    const date = new Date();
    const additionDate = date.toLocaleDateString();

    fetch("http://localhost:4567/add-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, size, ingredients, mark, expiration, additionDate, inclusions })
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error("Error adding label:", error));
}

export function removeLabel(label) {
    console.log("REMOVE");

    const name = label.name;
    const size = label.size;

    fetch(`http://localhost:4567/delete-label?name=${encodeURIComponent(name)}&size=${size}`, {
        method: "DELETE",
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error("Error deleting label:", error));
}