import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = (props: { loggedIn: any; email: any; setLoggedIn: any }) => {
    const { loggedIn, email } = props;
    const navigate = useNavigate();

    const onButtonClickLogIn = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            props.setLoggedIn(false);
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
            <div style={styles.titleContainer}>SignUp or log in</div>
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
                    value="SignUp"
                />
                {loggedIn && <div>Your username is {email}</div>}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    body: {
        backgroundColor: "red",
        margin: 0,
        fontFamily: "Arial, sans-serif",
    },
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f8f8f8",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        margin: "20px",
    },

    titleContainer: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: "black",
    },

    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
    },

    inputButton: {
        backgroundColor: "#ecb753",
        color: "black",
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
    },

    signInButton: {
        backgroundColor: "#ecb753",
        color: "black",
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Welcome;