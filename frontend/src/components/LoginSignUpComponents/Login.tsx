import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth";

const Login = (props: any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rightCredentials, setRightCredentials] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const onButtonClick = () => {
        setUsernameError("");
        setPasswordError("");

        if (username === "") {
            setUsernameError("Please enter your username");
            return;
        }

        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        try {
            fetch("http://127.0.0.1:8000/users/dj-rest-auth/login/", {
                method: "POST",
                body: JSON.stringify({ username, password }),
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
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("userID", data.id);
                    localStorage.setItem("userRole", data.role);

                    if (
                        data.non_field_errors &&
                        data.non_field_errors[0] === "Unable to log in with provided credentials."
                    ) {
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
    };

    const handleCancel = () => {
        window.location.href = `/`;
    };

    return (
        <div className="mainContainer" style={styles.mainContainer}>
            <div className="titleContainer" style={styles.titleContainer}>
                <div>Login</div>
            </div>
            <br />
            <div className="inputContainer" style={styles.inputContainer}>
                <input
                    style={styles.inputBox}
                    value={username}
                    placeholder="Enter your username here"
                    onChange={(ev) => setUsername(ev.target.value)}
                />
                <label style={styles.errorLabel}>{usernameError}</label>
            </div>
            <br />
            <div className="inputContainer" style={styles.inputField}>
                <div style={styles.passwordInputContainer}>
                    <input
                        style={styles.inputBox2}
                        value={password}
                        placeholder="Enter your password here"
                        onChange={(ev) => setPassword(ev.target.value)}
                        type={showPassword ? "text" : "password"}
                    />
                    <button
                        style={styles.eyeButton}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
                <label style={styles.errorLabel}>{passwordError}</label>
            </div>
            <br />
            <div className="inputContainer" style={styles.buttonContainer}>
                <input
                    style={styles.inputButton}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"}
                />
                <input
                    style={styles.inputButton}
                    type="button"
                    onClick={handleCancel}
                    value={"Cancel"}
                />
            </div>
            {!rightCredentials && (
                <div style={styles.errorLabel}>Invalid username or password.</div>
            )}
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
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        maxWidth: "500px",
        margin: "60px auto",
    },
    titleContainer: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "rgba(121,156,178,1)",
        marginBottom: "20px",
    },
    inputContainer: {
        marginBottom: "20px",
        width: "100%",
    },
    inputField: {
        width: "100%",
    },
    inputBox: {
        height: "40px",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(121, 156, 178, 0.6)",
        borderRadius: "6px",
        padding: "0 10px",
        fontSize: "16px",
        color: "white",
        outline: "none",
    },
    inputBox2: {
        height: "40px",
        width: "230px",
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(121, 156, 178, 0.6)",
        borderRadius: "6px",
        padding: "0 10px",
        fontSize: "16px",
        color: "white",
        outline: "none",
    },
    passwordInputContainer: {
        display: "flex",
        alignItems: "center",
    },
    eyeButton: {
        backgroundColor: "rgba(121, 156, 178, 0.6)",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "8px 10px",
        cursor: "pointer",
        marginLeft: "10px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: "10px",
        marginTop: "20px",
    },
    inputButton: {
        flex: 1,
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",
        padding: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    errorLabel: {
        color: "#ff6b6b",
        fontSize: "14px",
        marginTop: "5px",
        fontWeight: "600",
    },
};

export default Login;
