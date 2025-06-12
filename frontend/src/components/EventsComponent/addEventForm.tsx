import React, { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";
import { Skill } from "../../models/Skill";
import { getAuthToken, getUserID } from "../../util/auth";

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
                const [skillsRes, prefsRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/skills", {
                        headers: {
                            Authorization: `token ${getAuthToken()}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch("http://127.0.0.1:8000/preferences", {
                        headers: {
                            Authorization: `token ${getAuthToken()}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                const prefData = await prefsRes.json();
                const skillData = await skillsRes.json();
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
                    'Authorization': `token ${getAuthToken()}`,
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
                <h2 style={styles.heading}>Add New Event</h2>
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
                            style={styles.textarea}
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

                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.buttonGroup}>
                        <button type="submit" style={styles.button}>Submit</button>
                        <button type="button" style={styles.button} onClick={handleCancel}>Cancel</button>
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
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },
    modal: {
        backgroundColor: "rgb(100, 100, 100)",
        padding: "30px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        color: "#fff",
        boxShadow: "0 0 15px rgba(0,0,0,0.4)",
    },
    heading: {
        marginBottom: "20px",
        fontSize: "22px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    label: {
        width: "100%",
        fontSize: "14px",
        fontWeight: 500,
    },
    inputBox: {
        width: "100%",
        height: "35px",
        backgroundColor: "#2b2b2b",
        border: "1px solid #444",
        borderRadius: "6px",
        padding: "0 10px",
        color: "#fff",
        fontSize: "14px",
        marginTop: "6px",
    },
    textarea: {
        width: "100%",
        backgroundColor: "#2b2b2b",
        border: "1px solid #444",
        borderRadius: "6px",
        padding: "10px",
        color: "#fff",
        fontSize: "14px",
        marginTop: "6px",
    },
    bubbleContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "10px",
    },
    bubble: {
        padding: "6px 12px",
        backgroundColor: "#2b2b2b",
        borderRadius: "20px",
        cursor: "pointer",
        border: "1px solid #555",
        color: "#f0f0f0",
        transition: "background-color 0.2s ease",
        fontSize: "13px",
    },
    bubbleSelected: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",

    },
};

export default AddEventForm;