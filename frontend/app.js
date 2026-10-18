
const API_URL = "http://localhost:3000/api/clubs";

const clubForm = document.getElementById("clubForm");
const clubId = document.getElementById("clubId");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const message = document.getElementById("message");
const tableBody = document.getElementById("clubsTableBody");
const clubCount = document.getElementById("clubCount");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#b91c1c" : "#176b43";
}

async function loadClubs() {
    tableBody.innerHTML =
        '<tr><td colspan="7">Loading clubs...</td></tr>';

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not load clubs.");
        }

        tableBody.innerHTML = "";

        result.data.forEach((club) => {
            const row = document.createElement("tr");

            const values = [
                club.id,
                club.name,
                club.category,
                club.president,
                club.email,
                club.meeting_day
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-button";
            editButton.addEventListener("click", () => {
                editClub(club);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";
            deleteButton.addEventListener("click", () => {
                deleteClub(club.id, club.name);
            });

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });

        clubCount.textContent =
            `Total clubs: ${result.count}`;

        if (result.data.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="7">No clubs registered yet.</td></tr>';
        }
    } catch (error) {
        tableBody.innerHTML =
            '<tr><td colspan="7">Could not connect to the API.</td></tr>';

        clubCount.textContent = "Unable to load clubs.";
        showMessage(
            "Error loading clubs. Check that the backend server is running.",
            true
        );

        console.error("Load clubs error:", error);
    }
}

clubForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = clubId.value;

    const club = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim(),
        president: document.getElementById("president").value.trim(),
        email: document.getElementById("email").value.trim(),
        meeting_day: document.getElementById("meeting_day").value
    };

    const isEditing = id !== "";
    const url = isEditing ? `${API_URL}/${id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    saveButton.disabled = true;
    showMessage(isEditing ? "Updating club..." : "Adding club...");

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(club)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "The request failed.");
        }

        showMessage(result.message);
        resetForm();
        await loadClubs();
    } catch (error) {
        showMessage(error.message, true);
        console.error("Save club error:", error);
    } finally {
        saveButton.disabled = false;
    }
});

function editClub(club) {
    clubId.value = club.id;
    document.getElementById("name").value = club.name;
    document.getElementById("category").value = club.category;
    document.getElementById("description").value = club.description;
    document.getElementById("president").value = club.president;
    document.getElementById("email").value = club.email;
    document.getElementById("meeting_day").value = club.meeting_day;

    formTitle.textContent = "Edit Club";
    saveButton.textContent = "Update Club";
    cancelButton.hidden = false;

    document.getElementById("name").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteClub(id, name) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not delete club.");
        }

        showMessage(result.message);
        await loadClubs();
    } catch (error) {
        showMessage(error.message, true);
        console.error("Delete club error:", error);
    }
}

function resetForm() {
    clubForm.reset();
    clubId.value = "";
    formTitle.textContent = "Add a New Club";
    saveButton.textContent = "Add Club";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);
document.getElementById("refreshButton").addEventListener("click", loadClubs);

// Load existing clubs when the page opens.
loadClubs();
