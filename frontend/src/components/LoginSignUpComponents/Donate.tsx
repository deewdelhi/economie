import { CSSProperties, useState } from "react";

const Donate = () => {
    const [shouldShow, setShouldShow] = useState<number>(1);
    const [name, setName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const handleDonate = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your donation! ❤️");
        setShouldShow(0);

        setTimeout(() => {
            const isUserEventPage = window.location.href.includes("/userEvents");
            window.location.href = isUserEventPage ? `/userEvents/` : `/showlist/`;
        }, 500);
    };

    const handleCancel = () => {
        setShouldShow(0);
        const isUserEventPage = window.location.href.includes("/userEvents");
        window.location.href = isUserEventPage ? `/userEvents/` : `/showlist/`;
    };

    if (shouldShow !== 1) return null;

    return (
        <div style={styles.popup}>
            <h2 style={styles.heading}>Support Our Platform</h2>
            <p style={styles.text}>We truly appreciate your generosity 🙏</p>
            <form onSubmit={handleDonate} style={styles.form}>
                <input
                    type="text"
                    placeholder="Name on Card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    style={styles.input}
                />
                <div style={styles.row}>
                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        style={{ ...styles.input, marginRight: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.buttonsContainer}>
                    <button type="submit" style={styles.inputButton}>
                        Donate 💖
                    </button>
                    <button type="button" style={styles.cancelButton} onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    popup: {
        backgroundColor: "rgba(50,50,50,0.85)",
        padding: "24px",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "100px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        color: "white",
    },
    heading: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "rgba(121,156,178,1)",
    },
    text: {
        fontSize: "14px",
        marginBottom: "16px",
        color: "rgba(121, 156, 178, 0.6)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        border: "1px solid rgba(121,156,178,0.6)",
        borderRadius: "4px",
        marginBottom: "12px",
        backgroundColor: "transparent",
        color: "white",
    },
    row: {
        display: "flex",
        gap: "10px",
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
    },
    inputButton: {
        backgroundColor: "rgba(121,156,178,1)",
        color: "white",
        padding: "10px 20px",
        fontSize: "14px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 10px",
    },
    cancelButton: {
        backgroundColor: "rgba(121, 156, 178, 0.6)",
        color: "white",
        padding: "10px 20px",
        fontSize: "14px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 10px",
    },
};

export default Donate;
