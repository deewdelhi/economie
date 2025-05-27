import React, { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";
import { Skill } from "../../models/Skill";
import { getUserID } from "../../util/auth";

const AddEventForm = () => {
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [isEventAdded, setIsEventAdded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        preferences: [],
        starting_date: "",
        ending_date: "",
        capacity: "",
        location: "",
        skills: [],
        creator: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prefRes, skillRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/preferences/?format=json"),
                    fetch("http://127.0.0.1:8000/skills/?format=json"),
                ]);
                const prefData = await prefRes.json();
                const skillData = await skillRes.json();
                setPreferences(prefData);
                setSkills(skillData);
            } catch {
                setError("Failed to fetch preferences or skills");
            }
        };

        fetchData();
    }, []);

    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const togglePreference = (id: number) => {
        setSelectedPreferences(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleSkill = (id: number) => {
        setSelectedSkills(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleCancel = () => {
        const redirectPath = window.location.href.includes("/userEvents")
            ? "/userEvents/"
            : "/showlist/";
        window.location.href = redirectPath;
    };

    const addEvent = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/events/", {
                method: "POST",
                body: JSON.stringify({
                    name: eventData.name,
                    description: eventData.description,
                    preferences: selectedPreferences,
                    starting_date: eventData.starting_date,
                    ending_date: eventData.ending_date,
                    capacity: eventData.capacity,
                    location: eventData.location,
                    skills: selectedSkills,
                    creator: getUserID(),
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                setError(response.status === 400 ? "Bad Request: Invalid data" : "Event addition failed");
                return;
            }

            setIsEventAdded(true);
            setTimeout(() => handleCancel(), 2500);
        } catch {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Add New Event</h2>
                <form onSubmit={addEvent} style={styles.form}>
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
                            name="description"
                            value={eventData.description}
                            onChange={handleEventDataChange}
                            rows={4}
                            style={styles.inputBoxDesc}
                        />
                    </label>
                    <label style={styles.label}>
                        Starting Date:
                        <input
                            style={styles.inputBox}
                            type="date"
                            name="starting_date"
                            value={eventData.starting_date}
                            onChange={handleEventDataChange}
                        />
                    </label>
                    <label style={styles.label}>
                        Ending Date:
                        <input
                            style={styles.inputBox}
                            type="date"
                            name="ending_date"
                            value={eventData.ending_date}
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

                    <label style={styles.label}>Preferences:</label>
                    <div style={styles.bubbleContainer}>
                        {preferences.map(p => (
                            <div
                                key={p.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedPreferences.includes(p.id) ? styles.bubbleSelected : {}),
                                }}
                                onClick={() => togglePreference(p.id)}
                            >
                                {p.name}
                            </div>
                        ))}
                    </div>

                    <label style={styles.label}>Skills:</label>
                    <div style={styles.bubbleContainer}>
                        {skills.map(s => (
                            <div
                                key={s.id}
                                style={{
                                    ...styles.bubble,
                                    ...(selectedSkills.includes(s.id) ? styles.bubbleSelected : {}),
                                }}
                                onClick={() => toggleSkill(s.id)}
                            >
                                {s.name}
                            </div>
                        ))}
                    </div>

                    <div id="buttons-container">
                        {error && <div style={styles.error}>{error}</div>}
                        <button type="submit" style={styles.button} disabled={!!error}>
                            Submit
                        </button>
                        <button type="button" style={styles.button} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// STYLES
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
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333",
        outline: "none",
    },
    inputBoxDesc: {
        width: "300px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333",
        outline: "none",
        resize: "vertical",
    },
    error: {
        color: "red",
        margin: "10px 0",
    },
    bubbleContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "10px",
    },
    bubble: {
        padding: "5px 10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "15px",
        cursor: "pointer",
    },
    bubbleSelected: {
        backgroundColor: "#f56c6c",
        color: "white",
    },
};

export default AddEventForm;
