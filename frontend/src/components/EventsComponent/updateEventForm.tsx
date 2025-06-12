import React, { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";
import { Skill } from "../../models/Skill.ts";
import {
    getAuthToken,
    getUserID,
} from "../../util/auth";

const UpdateEventForm = (props: { eventToUpdate: any }) => {
    const [isEventAdded, setIsEventAdded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDateForInput = (date: string | Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<number[]>(
        props.eventToUpdate.preferences || []
    );
    const [selectedSkills, setSelectedSkills] = useState<number[]>(
        props.eventToUpdate.skills || []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/preferences/?format=json",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `token ${getAuthToken()}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                setPreferences(data);

                const response2 = await fetch(
                    "http://127.0.0.1:8000/skills/?format=json",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `token ${getAuthToken()}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data2 = await response2.json();
                setSkills(data2);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (props.eventToUpdate.preferences?.length) {
            setSelectedPreferences(props.eventToUpdate.preferences);
        }
    }, [preferences]);

    useEffect(() => {
        if (props.eventToUpdate.skills?.length) {
            setSelectedSkills(props.eventToUpdate.skills);
        }
    }, [skills]);

    const [eventData, setEventData] = useState({
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
                ? prevSelected.filter((skillId) => skillId !== id)
                : [...prevSelected, id]
        );
    };

    const handleCancel = () => {
        const isUserEventPage = window.location.href.includes("/userEvents");
        if (isUserEventPage) {
            window.location.href = `/userEvents/`;
        } else {
            window.location.href = `/showlist/`;
        }
    };

    const handleEventDataChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const updateEvent = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        let preferencesToSend = selectedPreferences.length === 0 ? eventData.preferences : selectedPreferences;

        const updatedData = {
            name: eventData.name,
            description: eventData.description,
            preferences: preferencesToSend,
            starting_date: eventData.starting_date,
            ending_date: eventData.ending_date,
            capacity: eventData.capacity,
            location: eventData.location,
            creator: getUserID(),
        };

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/events/${props.eventToUpdate.id}/?user=${getUserID()}`,
                {
                    method: "PUT",
                    body: JSON.stringify(updatedData),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `token ${getAuthToken()}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 400) {
                    setError("Bad Request: Invalid data");
                } else {
                    setError("Event update failed");
                }
            } else {
                setIsEventAdded(true);
            }
        } catch (error) {
            console.error(error);
        }

        setTimeout(() => {
            const isUserEventPage = window.location.href.includes("/userEvents");
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
                    <label style={styles.label}>
                        Name:
                        <input
                            style={styles.inputBox}
                            type="text"
                            name="name"
                            value={eventData.name}
                            onChange={handleEventDataChange}
                        />
                    </label>

                    <label style={styles.label}>
                        Description:
                        <textarea
                            style={styles.inputBoxDesc}
                            name="description"
                            value={eventData.description}
                            onChange={handleEventDataChange}
                            rows={4}
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
                            type="text"
                            name="location"
                            value={eventData.location}
                            onChange={handleEventDataChange}
                        />
                    </label>

                    <label style={styles.label}>Preferences</label>
                    <div style={styles.bubbleContainer}>
                        {preferences.map((preference) => (
                            <div
                                key={preference.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedPreferences.includes(preference.id)
                                        ? styles.bubbleSelected
                                        : {}),
                                }}
                                onClick={() => togglePreference(preference.id)}
                            >
                                {preference.name}
                            </div>
                        ))}
                    </div>

                    <label style={styles.label}>Skills</label>
                    <div style={styles.bubbleContainer}>
                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedSkills.includes(skill.id)
                                        ? styles.bubbleSelected
                                        : {}),
                                }}
                                onClick={() => toggleSkill(skill.id)}
                            >
                                {skill.name}
                            </div>
                        ))}
                    </div>

                    <div id="buttons-container" style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
                        {error && <div style={styles.error}>{error}</div>}
                        <button type="submit" style={styles.button}>
                            Submit
                        </button>
                        <button
                            type="button"
                            style={styles.button}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
        background: "#ffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        color: "rgba(121, 156, 178, 1)",
        overflowY: "auto",
        maxHeight: "60vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        marginBottom: 10,
        textAlign: "left",
        color: "rgba(50, 50, 50, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "320px",
    },
    button: {
        padding: "10px 20px",
        marginTop: "10px",
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "background-color 0.3s ease",
    },
    inputBox: {
        height: "30px",
        width: "300px",
        backgroundColor: "#f0f0f0",
        border: "1px solid rgba(121, 156, 178, 1)",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "rgba(50, 50, 50, 0.85)",
        outline: "none",
    },
    inputBoxDesc: {
        width: "300px",
        backgroundColor: "#f0f0f0",
        border: "1px solid rgba(121, 156, 178, 1)",
        borderRadius: "3px",
        padding: "6px 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "rgba(50, 50, 50, 0.85)",
        outline: "none",
        resize: "vertical",
    },
    error: {
        color: "red",
        margin: "10px 0",
        fontWeight: "600",
    },
    bubbleContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        margin: "10px 0 20px",
        width: "320px",
    },
    bubble: {
        padding: "10px 15px",
        border: "1px solid rgba(121, 156, 178, 1)",
        borderRadius: "30px",
        cursor: "pointer",
        backgroundColor: "white",
        color: "rgba(121, 156, 178, 1)",
        transition: "all 0.2s ease-in-out",
        fontSize: "14px",
        userSelect: "none",
    },
    bubbleSelected: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",
        borderColor: "rgba(121, 156, 178, 1)",
    },
};

export default UpdateEventForm;
