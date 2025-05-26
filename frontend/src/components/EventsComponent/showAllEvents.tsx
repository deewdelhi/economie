import { Event } from "../../models/Event";
import React, { useState, useEffect, CSSProperties } from "react";
import { Link } from "react-router-dom";
import EventDetailsForm from "./eventDetailsForm.tsx";

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
    const [filters, setFilters] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`
                );
                const data2 = await response2.json();
                setAllEvents(data2);
                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage}&${filters}&format=json`
                );
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleClickPrev = () => {
        setCurrentPage(currentPage - 1);
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`
                );
                const data2 = await response2.json();
                setAllEvents(data2);
                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage - 1}&${filters}&format=json`
                );
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    };

    const handleClickNext = () => {
        setCurrentPage(currentPage + 1);
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`
                );
                const data2 = await response2.json();
                setAllEvents(data2);
                const response = await fetch(
                    `http://127.0.0.1:8000/events/?page=${currentPage + 1}&${filters}&format=json`
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
            <div style={styles.topBar}>
                <input
                    type="text"
                    placeholder="Search events by name..."
                    value={filterName}
                    onChange={handleSearchChange}
                    style={styles.searchBar}
                />
                <button style={styles.inputButton} onClick={() => setCurrentPage(1)}>Search</button>
            </div>

            <div style={styles.eventsContainer}>
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        style={{
                            ...styles.listItem,
                            ...(index % 2 === 0 ? styles.evenItem : styles.oddItem),
                        }}
                    >
                        <div className="title" style={{ marginBottom: "10px" }}>
                            {event.name}
                        </div>
                        <button
                            style={{
                                ...styles.button,
                                ...(index % 2 === 0 ? styles.whiteButton : styles.yellowButton),
                            }}
                            onClick={() => {
                                setSelectedEventId(event.id!);
                                setDesiredCommand(2);
                            }}
                        >
                            View Details
                        </button>
                        {selectedEventId === event.id &&
                            desiredCommand === 2 && (
                                <EventDetailsForm eventDetail={event} />
                            )}
                    </div>
                ))}
            </div>

            <div style={styles.buttonContainer}>
                <button
                    style={styles.inputButton}
                    onClick={handleClickPrev}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span style={{ margin: "0 10px" }}>{currentPage}</span>
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
    topBar: {
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        justifyContent: "space-between",
    },
    searchBar: {
        flex: 1,
        padding: "10px",
        fontSize: "16px",
        marginRight: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
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
        backgroundColor: "#ecb753",
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
        color: "#ecb753",
    },
    yellowButton: {
        backgroundColor: "#ecb753",
        color: "#ffffff",
    },
    inputButton: {
        backgroundColor: "#ecb753",
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
};

export default EventList;
