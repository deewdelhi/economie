import { CSSProperties, useState } from "react";
import { getAuthToken } from "../../util/auth";

const DeleteEvent = ({ eventToDelete }: { eventToDelete: any }) => {
    const [shouldShow, setShouldShow] = useState(true);

    const handleDelete = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://127.0.0.1:8000/events/${eventToDelete.id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `token ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Failed to delete event.");
                return;
            }

            // Delay navigation after deletion
            setTimeout(() => {
                const isUserEventPage = window.location.href.includes("/userEvents");
                window.location.href = isUserEventPage ? "/userEvents/" : "/showlist/";
            }, 500);

        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleCancel = () => {
        const isUserEventPage = window.location.href.includes("/userEvents");
        window.location.href = isUserEventPage ? "/userEvents/" : "/showlist/";
    };

    if (!shouldShow) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.dialogBox}>
                <p style={styles.text}>Are you sure you want to delete this event?</p>
                <div style={styles.buttonContainer}>
                    <button style={styles.confirmButton} onClick={handleDelete}>
                        Yes
                    </button>
                    <button style={styles.cancelButton} onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    dialogBox: {
        backgroundColor: "#333",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%",
    },
    text: {
        fontSize: "18px",
        marginBottom: "20px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
        gap: "20px",
    },
    confirmButton: {
        backgroundColor: "#d9534f",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "#5bc0de",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default DeleteEvent;
