import React, { useState } from "react";

interface Participant {
    id: number;
    username: string;
}

interface ParticipantRatingPopupProps {
    participants: Participant[];
    eventId: number;
    onClose: () => void;
}

const ParticipantRatingPopup: React.FC<ParticipantRatingPopupProps> = ({
    participants,
    eventId,
    onClose,
}) => {
    const [ratings, setRatings] = useState<{ [userId: number]: number }>({});

    const handleStarClick = (userId: number, rating: number) => {
        setRatings(prev => ({ ...prev, [userId]: rating }));
    };

    const submitRating = async (userId: number) => {
        const rating = ratings[userId];
        if (!rating) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/ratings/${eventId}/${userId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`, // Adjust to your auth logic
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });

            if (response.ok) {
                alert(`Rated ${userId} with ${rating} star(s)`);
            } else {
                alert("Failed to submit rating");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <h2>Rate Participants</h2>
                {participants.map(participant => (
                    <div key={participant.id} style={styles.participantBlock}>
                        <span><b>{participant.username}</b></span>
                        <div style={styles.stars}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <span
                                    key={num}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "24px",
                                        color: ratings[participant.id] >= num ? "#ffd700" : "#ccc"
                                    }}
                                    onClick={() => handleStarClick(participant.id, num)}
                                >
                                    ★
                                </span>
                            ))}
                            <button
                                style={styles.submitButton}
                                onClick={() => submitRating(participant.id)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={onClose} style={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
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
    popup: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    participantBlock: {
        marginBottom: "20px",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
    },
    stars: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "5px"
    },
    submitButton: {
        marginLeft: "20px",
        padding: "5px 10px",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer",
        borderRadius: "4px"
    },
    closeButton: {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px"
    }
};

export default ParticipantRatingPopup;
