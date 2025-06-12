import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Skill } from "../../models/Skill";
import { Preference } from "../../models/Preference";
import { getAuthToken, getUserID } from "../../util/auth";

const overlayColor = "rgba(121, 156, 178, 0.8)"; // Combined color

const UserUpdate = () => {
    const [user, setUser] = useState<User | null>(null);
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
    const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<number[]>([]);
    const [showSkillsPopup, setShowSkillsPopup] = useState(false);
    const [showPreferencesPopup, setShowPreferencesPopup] = useState(false);
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

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

                const [skills, preferences] = await Promise.all([
                    skillsRes.json(),
                    prefsRes.json(),
                ]);

                setAllSkills(skills);
                setAllPreferences(preferences);

                const userId = getUserID();
                const userRes = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
                    headers: {
                        Authorization: `token ${getAuthToken()}`,
                        "Content-Type": "application/json",
                    },
                });

                const userData: User = await userRes.json();
                setUser(userData);
                setUsername(userData.username);
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setDescription(userData.description);
                setSelectedSkillIds(userData.skills.map(Number));
                setSelectedPreferenceIds(userData.preferences.map(Number));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);

    const toggleItem = (id: number, list: number[], setter: (ids: number[]) => void) => {
        setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
    };

    const handleSave = async () => {
        const updatedUserData = {
            username,
            first_name: firstName,
            last_name: lastName,
            description,
            skills: selectedSkillIds,
            preferences: selectedPreferenceIds,
        };

        try {
            const userId = getUserID();
            const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `token ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) throw new Error("Failed to update user");

            navigate("/userDetail");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!user) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading user data...</div>;

    return (
        <div
            style={{
                maxWidth: 450,
                margin: "2rem auto",
                padding: "2rem",
                backgroundColor: "#fff",
                borderRadius: 12,
                boxShadow: "0 0 15px rgba(121, 156, 178, 0.3)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2 style={{ textAlign: "center", color: "rgba(121, 156, 178, 1)", marginBottom: 24 }}>
                Update User Profile
            </h2>

            {[
                { label: "Username", value: username, onChange: setUsername },
                { label: "First Name", value: firstName, onChange: setFirstName },
                { label: "Last Name", value: lastName, onChange: setLastName },
            ].map(({ label, value, onChange }) => (
                <label
                    key={label}
                    style={{
                        display: "block",
                        marginBottom: 16,
                        fontWeight: 600,
                        color: "rgba(107, 107, 107, 0.9)",
                    }}
                >
                    {label}:
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: 6,
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: `1.5px solid rgba(121, 156, 178, 0.8)`,
                            fontSize: 16,
                            color: "#fff",
                            transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = overlayColor)}
                        onBlur={(e) => (e.target.style.borderColor = `rgba(121, 156, 178, 0.8)`)}
                    />
                </label>
            ))}

            <label
                style={{
                    display: "block",
                    marginBottom: 20,
                    fontWeight: 600,
                    color: "rgba(107, 107, 107, 0.9)",
                }}
            >
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: 6,
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: `1.5px solid rgba(121, 156, 178, 0.8)`,
                        fontSize: 16,
                        resize: "vertical",
                        color: "#fff",
                        transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = overlayColor)}
                    onBlur={(e) => (e.target.style.borderColor = `rgba(121, 156, 178, 0.8)`)}
                />
            </label>

            <div style={{ marginBottom: 20 }}>
                <strong style={{ color: "rgba(121, 156, 178, 1)" }}>Skills:</strong>{" "}
                <span style={{ color: "rgba(50,50,50,0.85)" }}>
                    {selectedSkillIds.length > 0
                        ? allSkills
                            .filter((skill) => selectedSkillIds.includes(skill.id))
                            .map((skill) => skill.name)
                            .join(", ")
                        : "No skills selected"}
                </span>
                <button
                    onClick={() => setShowSkillsPopup(true)}
                    style={{
                        marginLeft: 12,
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: overlayColor,
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(121, 156, 178, 0.4)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(121,156,178,1)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = overlayColor)}
                >
                    Edit Skills
                </button>
            </div>

            <div style={{ marginBottom: 30 }}>
                <strong style={{ color: "rgba(121, 156, 178, 1)" }}>Preferences:</strong>{" "}
                <span style={{ color: "rgba(50,50,50,0.85)" }}>
                    {selectedPreferenceIds.length > 0
                        ? allPreferences
                            .filter((pref) => selectedPreferenceIds.includes(pref.id))
                            .map((pref) => pref.name)
                            .join(", ")
                        : "No preferences selected"}
                </span>
                <button
                    onClick={() => setShowPreferencesPopup(true)}
                    style={{
                        marginLeft: 12,
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: overlayColor,
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(121, 156, 178, 0.4)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(121,156,178,1)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = overlayColor)}
                >
                    Edit Preferences
                </button>
            </div>

            <button
                onClick={handleSave}
                style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: overlayColor,
                    color: "white",
                    fontSize: 18,
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 5px 10px rgba(121, 156, 178, 0.6)",
                    transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(121,156,178,1)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = overlayColor)}
            >
                Save Changes
            </button>

            {/* Skills Popup */}
            {showSkillsPopup && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: overlayColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: 12,
                            width: 320,
                            maxHeight: "70vh",
                            overflowY: "auto",
                            boxShadow: "0 0 20px rgba(121,156,178,0.7)",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: 20,
                                color: "rgba(121, 156, 178, 1)",
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            Select Skills
                        </h3>

                        {allSkills.map((skill) => (
                            <label
                                key={skill.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 12,
                                    fontSize: 16,
                                    color: "rgba(50,50,50,0.9)",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSkillIds.includes(skill.id)}
                                    onChange={() => toggleItem(skill.id, selectedSkillIds, setSelectedSkillIds)}
                                    style={{ marginRight: 10, width: 18, height: 18 }}
                                />
                                {skill.name}
                            </label>
                        ))}

                        <button
                            onClick={() => setShowSkillsPopup(false)}
                            style={{
                                marginTop: 16,
                                width: "100%",
                                padding: "10px",
                                borderRadius: 10,
                                border: "none",
                                backgroundColor: "rgba(107, 107, 107, 0.8)",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(90,90,90,0.9)")}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(107, 107, 107, 0.8)")}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Preferences Popup */}
            {showPreferencesPopup && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: overlayColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: 12,
                            width: 320,
                            maxHeight: "70vh",
                            overflowY: "auto",
                            boxShadow: "0 0 20px rgba(121,156,178,0.7)",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: 20,
                                color: "rgba(121, 156, 178, 1)",
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            Select Preferences
                        </h3>

                        {allPreferences.map((pref) => (
                            <label
                                key={pref.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 12,
                                    fontSize: 16,
                                    color: "rgba(50,50,50,0.9)",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPreferenceIds.includes(pref.id)}
                                    onChange={() =>
                                        toggleItem(pref.id, selectedPreferenceIds, setSelectedPreferenceIds)
                                    }
                                    style={{ marginRight: 10, width: 18, height: 18 }}
                                />
                                {pref.name}
                            </label>
                        ))}

                        <button
                            onClick={() => setShowPreferencesPopup(false)}
                            style={{
                                marginTop: 16,
                                width: "100%",
                                padding: "10px",
                                borderRadius: 10,
                                border: "none",
                                backgroundColor: "rgba(107, 107, 107, 0.8)",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(90,90,90,0.9)")}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = "rgba(107, 107, 107, 0.8)")}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserUpdate;
