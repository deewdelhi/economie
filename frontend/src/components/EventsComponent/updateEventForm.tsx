import React, { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";
import Select from "react-select";
import {
    getAuthToken,
    getUserID,
} from "../../util/auth";
import {Skill} from "../../models/Skill.ts";

const UpdateEventForm = (props: { eventToUpdate: any }) => {
         const [isEventAdded, setIsEventAdded] = useState(false);
                 let [error, setError] = useState<string | null>(null); // New state variable for error

    const formatDateForInput = (date: string | Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/preferences/?format=json"
                );
                const data = await response.json();
                setPreferences(data);

                const response2 = await fetch(
                    "http://127.0.0.1:8000/skills/?format=json"
                );
                const data2 = await response2.json();
                setSkills(data2);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<number[]>(
        props.eventToUpdate.preferences || []
    );
    const [selectedSkills, setSelectedSkills] = useState<number[]>(
        props.eventToUpdate.skills || []
    );

    useEffect(() => {
        if (props.eventToUpdate.preferences?.length) {
            setSelectedPreferences(props.eventToUpdate.preferences);
        }
    }, [preferences]); // run after preferences load

    useEffect(() => {
        if (props.eventToUpdate.skills?.length) {
            setSelectedSkills(props.eventToUpdate.skills);
        }
    }, [skills]);

    const [selectedEventType, setSelectedEventType] = useState(String);
9
    const [eventData, setEventData] = useState({
        // Define your form fields here
        name: props.eventToUpdate.name,
        description: props.eventToUpdate.description,
        starting_date: props.eventToUpdate.starting_date,
        ending_date: props.eventToUpdate.ending_date,
        capacity: props.eventToUpdate.capacity,
        location: props.eventToUpdate.location,
        preferences: props.eventToUpdate.preferences,
        skills: props.eventToUpdate.skills,
        creator: getUserID(),
    });

    const currentPreferencesSet = new Set();
    const currentSkillsSet = new Set();

    props.eventToUpdate.preferences.forEach((item: number) => {
        // Ensure 'preferences' array is defined and item is a valid index
        const preferenceIndex = item - 1;

        if (preferences && preferences[preferenceIndex] && preferences[preferenceIndex].name) {
            currentPreferencesSet.add(preferences[preferenceIndex].name);
        } else {
            console.error(
                `Invalid index or missing 'name' property for preference at index ${item}`
            );
        }
    });

    props.eventToUpdate.skills.forEach((item: number) => {
        const skillIndex = item - 1;

        if (skills && skills[skillIndex] && skills[skillIndex].name) {
            currentSkillsSet.add(skills[skillIndex].name);
        } else {
            console.error(
                `Invalid index or missing 'name' property for skills at index ${item}`
            );
        }
    });

    const togglePreference = (id: number) => {
        setSelectedPreferences((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((prefId) => prefId !== id)
                : [...prevSelected, id]
        );
    };

    const toggleSkill = (id: number) => {
        setSelectedSkills((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((prefId) => prefId !== id)
                : [...prevSelected, id]
        );
    };


    const handleCancel = () => {
        const isUserEventPage = window.location.href.includes('/userEvents');


            if (isUserEventPage) {
                    window.location.href = `/userEvents/`;
                }
            else{
                window.location.href = `/showlist/`;
            }
    };
    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const updateEvent = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let ing;

    try {
        if (selectedPreferences.length == 0) {
            ing = eventData.preferences;
        } else {
            ing = selectedPreferences;
        }
        console.log(selectedPreferences.length);

        const updatedData = {
            name: eventData.name,
            description: eventData.description,
            preferences: ing,
            starting_date: eventData.starting_date,
            ending_date: eventData.ending_date,
            capacity: eventData.capacity,
            location: eventData.location,
            creator: getUserID(),
        };

        const response = await fetch(`http://127.0.0.1:8000/events/${props.eventToUpdate.id}/?user=${getUserID()}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: {
                Accept: "application/json",
                "Content-Type":
                    "application/json;charset=UTF-8;multipart/form-data",
                Authorization: `Bearer ${getAuthToken()}`, // Include the Authorization header with the token
            },
        })
            if (!response.ok) {
        // Check the specific HTTP status code
        if (response.status === 400) {
            setError("Bad Request: Invalid data");
        } else {
            setError("Event addition failed");
        }
        console.error("Error response:", response.status);
        console.log(error);
        // Additional error handling logic as needed
    } else {
        // Event added successfully
        const data = await response.json();
        console.log(data);
        setIsEventAdded(true);
    }
    } catch (error) {
        console.error(error);
    }

    setTimeout(() => {
        const isUserEventPage = window.location.href.includes('/userEvents');

        if (isUserEventPage) {
            window.location.href = `/userEvents/`;
        } else {
            window.location.href = `/showlist/`;
        }
    }, 2500);
};
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Update the Event's Fields</h2>
                <form onSubmit={updateEvent} style={styles.form}>
                    {/* Render your form fields here */}

                    <label style={styles.label}>
                        Name:
                        <input
                            style={styles.inputBox}
                            type="string"
                            name="name"
                            value={eventData.name}
                            onChange={handleEventDataChange}
                        />
                    </label>
                    <label style={styles.label}>
                        Description:
                        <textarea
                            name="description"
                            value={eventData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleEventDataChange(e)
                            }
                            rows={4} // You can adjust the number of rows as needed
                            style={styles.inputBoxDesc} // Optional: Allow vertical resizing
                        />
                    </label>
                    <label style={styles.label}>
                        Starting date:
                        <input
                            style={styles.inputBox}
                            type="date"
                            name="starting_date"
                            value={formatDateForInput(eventData.starting_date)}
                            onChange={handleEventDataChange}
                        />


                    </label>
                    <label style={styles.label}>
                        Ending date:

                        <input
                            style={styles.inputBox}
                            type="date"
                            name="ending_date"
                            value={formatDateForInput(eventData.ending_date)}
                            onChange={handleEventDataChange}
                        />
                    </label>
                    <label style={styles.label}>
                        Capacity:
                        <input
                            style={styles.inputBox}
                            type="number"
                            name="capacity"
                            value={eventData.capacity}
                            onChange={handleEventDataChange}
                        />
                    </label>
                    <label style={styles.label}>
                        Location:
                        <input
                            style={styles.inputBox}
                            type="string"
                            name="location"
                            value={eventData.location}
                            onChange={handleEventDataChange}
                        />
                    </label>
                    <label>
                        Preferences
                    </label>
                    <div style={styles.bubbleContainer}>
                        {preferences.map((preference) => (
                            <div
                                key={preference.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedPreferences.includes(preference.id) ? styles.bubbleSelected : {}),
                                }}
                                onClick={() => togglePreference(preference.id)}
                            >
                                {preference.name}
                            </div>
                        ))}
                    </div>
                    <label>
                        Skills
                    </label>
                    <div style={styles.bubbleContainer}>
                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedPreferences.includes(skill.id) ? styles.bubbleSelected : {}),
                                }}
                                onClick={() => toggleSkill(skill.id)}
                            >
                                {skill.name}
                            </div>
                        ))}
                    </div>


                    <div id="buttons-container">
                        {error && <div style={styles.error}>{error}</div>} {/* Display error message */}
                        <button type="submit" style={styles.button}>
                            Submit
                        </button>
                        <button style={styles.button} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/////===========================================   STYLES  =====================================================
const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        background: "#ecb753",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        color: "black",
        overflowY: "auto", // Add overflowY to enable vertical scrolling
        maxHeight: "60vh", // Set a maximum height to fit the viewport
    },
    form: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
    },
    label: {
        marginBottom: 10,
        textAlign: "left", // Align labels to the left
        color: "black",
        display: "flex",
        flexDirection: "column", // Stack label and input vertically
        alignItems: "flex-start", // Align items to the start (left)
    },
    button: {
        padding: "10px",
        marginTop: "10px",
        backgroundColor: "white",
        color: "black",
        marginRight: "20px",
        marginLeft: "20px",
    },

    inputBox: {
        height: "30px",
        width: "300px",
        backgroundColor: "#f0f0f0", // Light gray input background
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333", // Dark gray text color
        outline: "none",
    },
    inputBoxDesc: {
        width: "300px",
        backgroundColor: "#f0f0f0", // Light gray input background
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333", // Dark gray text color
        outline: "none",
        resize: "vertical"
    },
    error: {
        color: "red",
        margin: "10px 0",
    },
    bubbleContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        margin: "20px 0",
    },

    bubble: {
        padding: "10px 15px",
        border: "1px solid black",
        borderRadius: "30px",
        cursor: "pointer",
        backgroundColor: "white",
        color: "black",
        transition: "all 0.2s ease-in-out",
        fontSize: "14px",
    },

    bubbleSelected: {
        backgroundColor: "black",
        color: "white",
    },

};
export default UpdateEventForm;