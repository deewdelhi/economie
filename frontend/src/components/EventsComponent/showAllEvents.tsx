import {Event} from "../../models/Event";
import React, {useState, useEffect, CSSProperties} from "react";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import EventDetailsForm from "./eventDetailsForm.tsx";
import AddEventForm from "./addEventForm.tsx";
import {FaSearch} from "react-icons/fa";
import {VscAccount} from "react-icons/vsc";
import {getAuthToken, getUserID} from "../../util/auth.tsx";

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState(-1);
    const [desiredCommand, setDesiredCommand] = useState(0);

    const [filterName, setFilterName] = useState("");
    const [filterStartingDate, setFilterStartingDate] = useState("");
    const [filterEndingDate, setFilterEndingDate] = useState("");
    const [filterCreator, setFilterCreator] = useState("");
    const [filterCapacity, setFilterCapacity] = useState("");
    const [filterLocation, setFilterLocation] = useState("");

    const [showFilterModalName, setShowFilterModalName] = useState(false);
    const isAnyFilterModalOpen = showFilterModalName;
    const [currentPage, setCurrentPage] = useState(1);
    const [showUserMenu, setShowUserMenu] = useState(false);
    let [filters, setFilters] = useState("");

    const [viewOption, setViewOption] = useState<"matching" | "all">("matching");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                console.log('token ' + getAuthToken())
                const data2 = await response2.json();
                setAllEvents(data2);

                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage}&${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [filters, currentPage]); // 👈 now it listens for filter and page changes

    const [skillEventList, setSkillEventList] = useState([]);

    useEffect(() => {
        const fetchSkillEvents = async () => {
            const response = await fetch(`http://127.0.0.1:8000/skills/user/${getUserID()}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data)
            setSkillEventList(data);
            console.log(skillEventList)
        };

        fetchSkillEvents();
    }, []);

    const handleClickPrev = () => {
        setCurrentPage(currentPage - 1);
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data2 = await response2.json();
                setAllEvents(data2);
                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage - 1}&${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    };

    const handleDeleteFilters = () => {
        setFilterName("");
        setFilterStartingDate("");
        setFilterEndingDate("");
        setFilterCapacity("");
        setFilterCreator("");
        setFilterLocation("");
        setFilters("");
        setCurrentPage(1);
    };

    const handleFilterSubmit = async () => {
        const f = new URLSearchParams();
        if (filterName) f.append("name", filterName);
        if (filterStartingDate) f.append("starting_date", filterStartingDate);
        if (filterEndingDate) f.append("ending_date", filterEndingDate);
        if (filterCreator) f.append("creator", filterCreator);
        if (filterCapacity) f.append("capacity", filterCapacity);
        if (filterLocation) f.append("location", filterLocation);

        const newFilters = f.toString();
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClickNext = () => {
        setCurrentPage(currentPage + 1);
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data2 = await response2.json();
                setAllEvents(data2);
                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage + 1}&${filters}&format=json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(e.target.value);
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.searchContainer}>
                <form style={styles.searchContainer} onSubmit={(e) => {
                    e.preventDefault();
                    handleFilterSubmit();
                }}>
                    <input
                        type="text"
                        placeholder="Search events by name..."
                        value={filterName}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    />
                    <button
                        onClick={() => setViewOption("matching")}
                        style={{
                            padding: "8px 12px",
                            backgroundColor: viewOption === "matching" ? "rgba(121, 156, 178, 1)" : "#f0f0f0",
                            border: "1px solid #ccc",
                            borderRadius: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Matching Events
                    </button>
                    <button
                        onClick={() => setViewOption("all")}
                        style={{
                            padding: "8px 12px",
                            backgroundColor: viewOption === "all" ? "rgba(121, 156, 178, 1)" : "#f0f0f0",
                            border: "0px solid #ccc",
                            borderRadius: "14px",
                            cursor: "pointer",
                            marginLeft: "20px"
                        }}
                    >
                        All Events
                    </button>

                </form>
                <button style={styles.searchIconButton} onClick={() => {
                    setShowFilterModalName(true);
                }}>
                    <FaSearch/>
                </button>
            </div>

            <div style={styles.userIconWrapper}>
                <button style={styles.userIconButton} onClick={() => setShowUserMenu((prev) => !prev)}>
                    <VscAccount/>
                </button>
                {showUserMenu && (
                    <div style={styles.userMenu}>
                        <Link to="/userDetail">
                            <button style={styles.userMenuItem}>Profile</button>
                        </Link>
                        <Link to="/logout">
                            <button style={styles.userMenuItem}>Logout</button>
                        </Link>
                        <Link to="/donate">
                            <button style={styles.userMenuItem}>Donate</button>
                        </Link>
                    </div>
                )}
            </div>

            {viewOption === "matching" ? (
                <div style={{marginTop: "20px"}}>
                    <h2 style={{fontSize: "24px", marginBottom: "10px"}}>Your Skills & Matching Events</h2>
                    {skillEventList.map((entry: any) => {
                        if (!entry || !entry.skill) {
                            return null; // skip if missing skill info
                        }
                        return (
                            <div key={entry.skill.id} style={{marginBottom: "30px"}}>
                                <h3 style={{fontSize: "20px", color: "rgba(121, 156, 178, 1)"}}>{entry.skill.name}</h3>
                                {entry.events && entry.events.length > 0 ? (
                                    <ul style={{paddingLeft: "20px"}}>
                                        {entry.events.map((event: Event) => (
                                            <li key={event.id}>
                                                <span
                                                    style={{fontWeight: "bold"}}>{event.name}</span> – {event.location} on{" "}
                                                {new Date(event.starting_date).toLocaleDateString()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{fontStyle: "italic"}}>No events available for this skill.</p>
                                )}
                            </div>
                        );
                    })}

                </div>
            ) : (
                <div style={styles.eventsContainer}>
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            style={{
                                ...styles.listItem,
                                ...(index % 2 === 0 ? styles.evenItem : styles.oddItem),
                            }}
                        >
                            <div className="title" style={{marginBottom: "10px"}}>
                                {event.name}
                            </div>

                            <button
                                style={{
                                    ...styles.button,
                                    ...(index % 2 === 0 ? styles.whiteButton : styles.yellowButton),
                                }}
                                onClick={() => navigate(`/events/${event.id}`, { state: event })}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {isAnyFilterModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Filter Events</h3>

                        <label>
                            Name:
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </label>
                        <label>
                            Creator:
                            <input
                                type="text"
                                value={filterCreator}
                                onChange={(e) => setFilterCreator(e.target.value)}
                            />
                        </label>
                        <label>
                            Starting Date:
                            <input
                                type="date"
                                value={filterStartingDate}
                                onChange={(e) => setFilterStartingDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Ending Date:
                            <input
                                type="date"
                                value={filterEndingDate}
                                onChange={(e) => setFilterEndingDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Capacity:
                            <input
                                type="number"
                                value={filterCapacity}
                                onChange={(e) => setFilterCapacity(e.target.value)}
                            />
                        </label>
                        <label>
                            Location:
                            <input
                                type="text"
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                            />
                        </label>

                        <div style={{marginTop: '10px'}}>
                            <button
                                style={styles.inputButton}
                                onClick={() => {
                                    handleFilterSubmit();
                                    setShowFilterModalName(false);
                                }}
                            >
                                Apply Filters
                            </button>
                            <button
                                style={{...styles.inputButton, marginLeft: '10px'}}
                                onClick={() => setShowFilterModalName(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p></p>
            {isAnyFilterModalOpen && (
                <button style={styles.inputButton} onClick={handleFilterSubmit}>
                    Submit Filters
                </button>
            )}
            {isAnyFilterModalOpen && (
                <button
                    style={styles.inputButton}
                    onClick={handleDeleteFilters}
                >
                    Delete Filters
                </button>
            )}


            <div style={styles.buttonContainer}>
                <button
                    style={styles.inputButton}
                    onClick={handleClickPrev}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span style={{margin: "0 10px"}}>{currentPage}</span>
                <button
                    style={styles.inputButton}
                    onClick={handleClickNext}
                    disabled={currentPage === Math.ceil(allEvents.length / 10)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    pageWrapper: {
        padding: "20px",
    },

    searchContainer: {
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "300px",
        zIndex: 100,
    },

    searchInput: {
        width: "100%",
        padding: "10px 40px 10px 10px", // leave space for icon on the right
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginBottom: "20px",
    },

    searchIconButton: {
        position: "absolute",
        left: "350px",
        top: "30px",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
    },

    eventsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
    },
    listItem: {
        width: "300px",
        border: "1px solid #ecb753",
        borderRadius: "5px",
        padding: "15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },
    evenItem: {
        backgroundColor: "#ffffff",
        color: "black",
    },
    oddItem: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "black",
    },
    button: {
        marginTop: "15px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    whiteButton: {
        backgroundColor: "#ffffff",
        color: "rgba(121, 156, 178, 1)",
    },
    yellowButton: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "#ffffff",
    },
    inputButton: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "#333333",
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: "20px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "black",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    userIconWrapper: {
        position: "absolute",
        border: "none",
        top: "20px",
        right: "20px",
    },

    userIconButton: {
        background: "transparent",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
    },

    userMenu: {
        position: "absolute",
        top: "40px",
        right: "0",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
    },

    userMenuItem: {
        background: "none",
        border: "none",
        padding: "8px 12px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        color: "#333",
    },
};

export default EventList;
