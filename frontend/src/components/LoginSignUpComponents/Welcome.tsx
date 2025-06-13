import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = (props: { loggedIn: any; email: any; setLoggedIn: any }) => {
    const { loggedIn, email, setLoggedIn } = props;
    const navigate = useNavigate();

    const onButtonClickLogIn = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            setLoggedIn(false);
        } else {
            navigate("/login");
        }
    };

    const onButtonClickSignUp = () => {
        navigate("/signUp");
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.titleContainer}>Welcome!</div>
            <div style={styles.subtitle}>Sign up or log in</div>
            <div style={styles.buttonContainer}>
                <input
                    style={styles.inputButton}
                    type="button"
                    onClick={onButtonClickLogIn}
                    value={loggedIn ? "Log out" : "Log in"}
                />
                <input
                    style={styles.signInButton}
                    type="button"
                    onClick={onButtonClickSignUp}
                    value="Sign up"
                />
                {loggedIn && (
                    <div style={styles.infoText}>Your username is {email}</div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        backgroundColor: "rgba(50, 50, 50, 0.85)",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        margin: "60px auto",
        maxWidth: "500px",
        color: "white",
    },
    titleContainer: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "rgba(121, 156, 178, 1)",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "18px",
        color: "rgba(121, 156, 178, 0.6)",
        marginBottom: "20px",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
    },
    inputButton: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "160px",
    },
    signInButton: {
        backgroundColor: "rgba(121, 156, 178, 0.6)",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "160px",
    },
    infoText: {
        marginTop: "20px",
        color: "#ddd",
        fontSize: "14px",
    },
};

export default Welcome;
