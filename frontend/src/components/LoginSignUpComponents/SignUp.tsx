import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

// Username
// Email
// Password1
// Password2
// First name
// Last name
// Description
// Date of birth


const SignUp = (props: any) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [first_name, setFirstName] = useState("");
    const [description, setDescription] = useState("");
    const [dob, setDob] = useState("");
    const [last_name, setLastName] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const handleCancel = () => {
        window.location.href = `/`;
    };

    const addNewUser = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        setEmailError("");
        setPasswordError("");

        // Check if the user has entered both fields correctly
        if ("" === email) {
            setEmailError("Please enter your email");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email");
            return;
        }

        if ("" === password1) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password1.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }
        if ("" === password2) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password2.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }
        const dateObj = new Date(dob);

        try {
            fetch("http://127.0.0.1:8000/users/registration/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    password1: password1,
                    password2: password2,
                    description: description,
                    date_of_birth: dateObj.toISOString(),
                    role: "regular",
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    console.log(
                        JSON.stringify({
                            username: username,
                            email: email,
                            password1: password1,
                            password2: password2,
                            first_name: first_name,
                            last_name: last_name,
                            role: "regular",
                        })
                    );
                });
        } catch (error) {
            console.error(error);
        }
        setTimeout(() => {
            navigate("/");
        }, 500);
    };

    return (
        <div className={"mainContainer"} style={styles.mainContainer}>
            <div className={"titleContainer"} style={styles.titleContainer}>
                <div>SignUp</div>
            </div>
            <br />
            <div className="inputContainer" style={styles.inputContainer}>
                <input
                    value={username}
                    style={styles.inputBox}
                    placeholder="Enter your username here"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className="inputBox"
                />
                {/* <label className="errorLabel">{usernameError}</label> */}
            </div>
            <br />

            {/* FIRST NAME */}
            <div className="inputContainer" style={styles.inputField}>
                <input
                    value={first_name}
                    style={styles.inputBox}
                    placeholder="Enter your first name here"
                    onChange={(ev) => setFirstName(ev.target.value)}
                    className="inputBox"
                />
                {/* <label className="errorLabel">{first_nameError}</label> */}
            </div>
            {/* LAST NAME */}
            <br />
            <div className="inputContainer" style={styles.inputField}>
                <input
                    value={last_name}
                    style={styles.inputBox}
                    placeholder="Enter your last name here"
                    onChange={(ev) => setLastName(ev.target.value)}
                    className="inputBox"
                />
                {/* <label className="errorLabel">{last_nameError}</label> */}
            </div>

            {/* EMAIL */}
            <br />

            <div className={"inputContainer"} style={styles.inputField}>
                <input
                    value={email}
                    style={styles.inputBox}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />

            {/* DESCRIPTION */}
            <br />

            <div className={"inputContainer"} style={styles.inputField}>
                <input
                    value={description}
                    style={styles.inputBox}
                    placeholder="Tell us something about yourself."
                    onChange={(ev) => setDescription(ev.target.value)}
                    className={"inputBox"}
                />
            </div>
            <br />

            <div>
                <label htmlFor="dob">Date of Birth:</label>
                <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />

            </div>

            {/* PASSWORD 1 */}
            <div className="inputContainer" style={styles.inputField}>
                <input
                    style={styles.inputBox}
                    value={password1}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword1(ev.target.value)}
                    className="inputBox"
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            {/* PASSWORD 2 */}
            <br />

            <div className="inputContainer" style={styles.inputField}>
                <input
                    value={password2}
                    style={styles.inputBox}
                    placeholder="Confirm your password here"
                    onChange={(ev) => setPassword2(ev.target.value)}
                    className="inputBox"
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>

            <br />

            <br />

            {/* SIGN UP BUTTON */}
            <div className={"inputContainer"} style={styles.buttonContainer}>
                <input
                    className={"inputButton"}
                    style={styles.inputButton}
                    type="button"
                    onClick={addNewUser}
                    value={"Sign Up"}
                />
                <input
                    className={"inputButton"}
                    style={styles.inputButton}
                    type="button"
                    onClick={handleCancel}
                    value={"Cancel"}
                />
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

export default SignUp;