import React, { CSSProperties } from "react";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    return isOpen ? (
        <div style={styles.overlay}>
            <div style={styles.modal} modal-class="modal-fullscreen">
                {children}
                <button style={styles.exitButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    ) : null;
};

const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    modal: {
        background: "white",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        position: "relative",
        width: "60%", // Adjust the width as needed
    },

    exitButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#ff6347", // Tomato color
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
    },
};

export default Popup;