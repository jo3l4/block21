const APIURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FTB-ET-WEB-PT/events';
const fetchAllEvents = async () => {
    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
};
const addEvent = async (eventData) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
    } catch (error) {
        console.error('Failed to add event:', error);
        throw error;
    }
};
const removeEvent = async (eventId) => {
    try {
        const response = await fetch(`${APIURL}/${eventId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete event. Status: ' + response.status);
        }
        return;
    } catch (error) {
        console.error('Failed to remove event:', error);
        throw error;
    }
};
const renderAllEvents = (eventsList) => {
    try {
        if (!Array.isArray(eventsList)) {
            console.error('Invalid events data:', eventsList);
            return;
        }
        eventsContainer.innerHTML = '';
        eventsList.forEach(async event => {
            try {
                const eventId = document.createElement('div');
                eventId.classList.add('event', 'Id');
                const eventName = document.createElement('h2');
                eventName.textContent = event.name;
                const eventDescription = document.createElement('p');
                eventDescription.textContent = `Description: ${event.description}`;
                const eventDate = document.createElement('p');
                eventDate.textContent = `Date: ${event.date}`;
                const eventTime = document.createElement('p');
                eventTime.textContent = `Time: ${event.time}`;
                const eventLocation = document.createElement('p');
                eventLocation.textContent = `Location: ${event.location}`;
                eventId.appendChild(eventName);
                eventId.appendChild(eventDescription);
                eventId.appendChild(eventDate);
                eventId.appendChild(eventTime);
                eventId.appendChild(eventLocation);
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Delete Party';
                removeButton.addEventListener('click', async () => {
                    await removeEvent(event.id);
                    const updatedEvents = await fetchAllEvents();
                    renderAllEvents(updatedEvents);
                });
                eventId.appendChild(removeButton);
                eventsContainer.appendChild(eventId);
            } catch (err) {
                console.error('Error rendering event:', err);
            }
        });
    } catch (err) {
        console.error('Technical Difficulties', err);
    }
};
const renderNewEventForm = () => {
    try {
        const eventForm = document.createElement("form");
        eventForm.innerHTML = `
            <label>Name: <input type="text" id="nameInput" placeholder="Name" required></label>
            <label>Description: <input type="text" id="descriptionInput" placeholder="Description" required></label>
            <label>Date: <input type="text" id="dateInput" placeholder="Date" required></label>
            <label>Time: <input type="text" id="timeInput" placeholder="Time" required></label>
            <label>Location: <input type="text" id="locationInput" placeholder="Location" required></label>
            <button type="submit">Add Party</button>
        `;
        eventForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const eventName = document.getElementById("nameInput").value;
            const eventDescription = document.getElementById("descriptionInput").value;
            const eventDate = document.getElementById("dateInput").value;
            const eventTime = document.getElementById("timeInput").value;
            const isoDateTime = `${eventDate}T${eventTime}:00Z`;
            const eventLocation = document.getElementById("locationInput").value;
            try {
                await addEvent({ name: eventName, description: eventDescription, date: eventDate, time: eventTime, location: eventLocation });
                const events = await fetchAllEvents();
                renderAllEvents(events);
            } catch (err) {
                console.error('oops', err);
                throw err;
            }
        });
        eventsContainer.appendChild(eventForm);
    } catch (err) {
        console.error('No partyyy GG', err);
        throw err;
    }
};
const init = async () => {
    try {
        const events = await fetchAllEvents();
        if (events === undefined) {
            console.error('Failed to fetch events data.');
            return;
        }
        renderAllEvents(events);
        renderNewEventForm();
    } catch (err) {
        console.error('Initialization error:', err);
    }
};
init();