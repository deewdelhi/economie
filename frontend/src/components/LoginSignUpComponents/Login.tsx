import React, { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth"

const Login = (props: any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rightCredentials, setRightCredentials] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const onButtonClick = () => {
        // Set initial error values to empty
        setUsernameError("");
        setPasswordError("");

        // Check if the user has entered both fields correctly
        if ("" === username) {
            setUsernameError("Please enter your username");
            return;
        }

        if ("" === username) {
            setUsernameError("Please enter a valid userneame");
            return;
        }

        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        try {
            fetch("http://127.0.0.1:8000/users/login/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const token = data.key;
                    localStorage.setItem("token", token);

                    const username = data.username;
                    localStorage.setItem("username", username);

                    const userID = data.id;
                    localStorage.setItem("userID", userID);

                    const userRole = data.role;
                    localStorage.setItem("userRole", userRole);

                    console.log(data.non_field_errors);

                    if (
                        data.non_field_errors &&
                        data.non_field_errors[0] ==
                        "Unable to log in with provided credentials."
                    ) {
                        // setTimeout(() => {
                        //     navigate("/");
                        // }, 500);
                        setRightCredentials(false);
                    } else {
                        setTimeout(() => {
                            navigate("/showlist");
                        }, 500);
                        setRightCredentials(true);
                    }
                });
        } catch (error) {
            console.error(error);
        }

        // setTimeout(() => {
        //     navigate("/showlist");
        // }, 500);
    };

    const handleCancel = () => {
        window.location.href = `/`;
    };

    return (
        <div className={"mainContainer"} style={styles.mainContainer}>
            <div className={"titleContainer"} style={styles.titleContainer}>
                <div>Login</div>
            </div>
            <br />
            <div className={"inputContainer"} style={styles.inputContainer}>
                <input
                    style={styles.inputBox}
                    value={username}
                    placeholder="Enter your username here"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className={"inputContainer"} style={styles.inputField}>
                <div className="passwordInputContainer">
                    <input
                        style={styles.inputBox2}
                        value={password}
                        placeholder="Enter your password here"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className={"inputBox passwordInput"}
                        type={showPassword ? "text" : "password"}
                    />
                    {/* Eye icon button to toggle password visibility */}
                    <button
                        className={"eyeButton"}
                        style={styles.eyeButton}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "👻" : "👻"}
                    </button>
                </div>
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"} style={styles.buttonContainer}>
                <input
                    className={"inputButton"}
                    style={styles.inputButton}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"}
                />
                <input
                    className={"inputButton"}
                    style={styles.inputButton}
                    type="button"
                    onClick={handleCancel}
                    value={"Cancel"}
                />
                {!rightCredentials && <div> you are STUPID</div>}
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
        padding: "40px", // Increased padding for larger size
        backgroundColor: "#ffffff", // White background
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        margin: "40px", // Increased margin for larger size
    },

    titleContainer: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: "black",
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

    inputContainer: {
        margin: "10px 0",
    },

    inputBox: {
        height: "30px",
        width: "300px",
        backgroundColor: "#f0f0f0", // Light gray input background
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333", // Dark gray text color
        outline: "none",
    },

    inputBox2: {
        height: "30px",
        width: "230px",
        backgroundColor: "#f0f0f0", // Light gray input background
        border: "1px solid #ccc",
        borderRadius: "3px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: "300",
        color: "#333333", // Dark gray text color
        outline: "none",
    },

    passwordInputContainer: {
        display: "flex",
        alignItems: "center",
    },

    eyeButton: {
        backgroundColor: "#ecb753", // Dark yellow button color
        color: "#333333", // Dark gray text color
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "5px",
    },

    buttonContainer: {
        display: "flex",
        marginTop: "20px",
    },

    inputButton: {
        backgroundColor: "#ecb753", // Dark yellow button color
        color: "#333333", // Dark gray text color
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        marginRight: "10px", // Margin between buttons
    },

    cancelButton: {
        backgroundColor: "#666666", // Dark gray button color
        color: "#ffffff", // White text color
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },

    errorLabel: {
        color: "#ff5555", // Red error text color
        marginTop: "5px",
    },
};

export default Login;