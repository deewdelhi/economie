import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const SignUp = (props: any) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [first_name, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [last_name, setLastName] = useState("");

  // Client-side errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Backend errors for each field (dynamic)
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string }>({});

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    window.location.href = `/`;
  };

  const addNewUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Clear all errors before validation
    setEmailError("");
    setPasswordError("");
    setBackendErrors({});

    // Client-side validation (email and password)
    if (email.trim() === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (password1 === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (password1.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    if (password2 === "") {
      setPasswordError("Please confirm your password");
      return;
    }

    if (password1 !== password2) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/dj-rest-auth/registration/",
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
            password1: password1,
            password2: password2,
            description: "Hello! I am " + username + "!",
            date_of_birth: dob,
            role: "regular",
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Server validation errors (usually in data as key: [array of errors])
        if (data) {
          // Flatten errors into a simple {field: message} object for display
          const errors: { [key: string]: string } = {};
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errors[key] = data[key].join(" ");
            } else if (typeof data[key] === "string") {
              errors[key] = data[key];
            }
          }
          setBackendErrors(errors);
        } else {
          setBackendErrors({ general: "Something went wrong." });
        }
        return; // stop here, don't navigate
      }

      // Success! Navigate after registration
      navigate("/");
    } catch (error) {
      setBackendErrors({ general: "Network error. Please try again later." });
      console.error(error);
    }
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
        {backendErrors.username && (
          <label style={styles.errorLabel}>{backendErrors.username}</label>
        )}
      </div>
      <br />

      <div className="inputContainer" style={styles.inputField}>
        <input
          value={first_name}
          style={styles.inputBox}
          placeholder="Enter your first name here"
          onChange={(ev) => setFirstName(ev.target.value)}
          className="inputBox"
        />
        {backendErrors.first_name && (
          <label style={styles.errorLabel}>{backendErrors.first_name}</label>
        )}
      </div>
      <br />

      <div className="inputContainer" style={styles.inputField}>
        <input
          value={last_name}
          style={styles.inputBox}
          placeholder="Enter your last name here"
          onChange={(ev) => setLastName(ev.target.value)}
          className="inputBox"
        />
        {backendErrors.last_name && (
          <label style={styles.errorLabel}>{backendErrors.last_name}</label>
        )}
      </div>
      <br />

      <div className={"inputContainer"} style={styles.inputField}>
        <input
          value={email}
          style={styles.inputBox}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={"inputBox"}
        />
        <label style={styles.errorLabel}>{emailError || backendErrors.email}</label>
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
          lang="en-CA"
          style={{ ...styles.inputBox, width: 300 }}
        />
        {backendErrors.date_of_birth && (
          <label style={styles.errorLabel}>{backendErrors.date_of_birth}</label>
        )}
      </div>
      <br />

      <div className="inputContainer" style={styles.passwordInputContainer}>
        <input
          style={styles.inputBox}
          value={password1}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword1(ev.target.value)}
          className="inputBox"
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <label style={styles.errorLabel}>{passwordError || backendErrors.password1}</label>

      <br />

      <div className="inputContainer" style={styles.passwordInputContainer}>
        <input
          value={password2}
          style={styles.inputBox}
          placeholder="Confirm your password here"
          onChange={(ev) => setPassword2(ev.target.value)}
          className="inputBox"
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <label style={styles.errorLabel}>{passwordError || backendErrors.password2}</label>

      <br />

      {/* Show general backend error */}
      {backendErrors.general && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {backendErrors.general}
        </div>
      )}

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
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)", // Soft shadow for depth
    maxWidth: "550px",
    margin: "auto",
  },
  titleContainer: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#0077cc",
    marginBottom: "15px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    width: "100%",
  },
  inputField: {
    marginBottom: "12px",
    width: "100%",
  },
  inputBox: {
    height: "44px",
    fontSize: "18px",
    paddingLeft: "10px",
    borderRadius: "8px",
    border: "1.5px solid #0077cc",
    outline: "none",
    width: "100%",
  },
  passwordInputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },
  eyeButton: {
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
  },
  errorLabel: {
    color: "red",
    fontSize: "14px",
    marginTop: "4px",
    fontWeight: "600",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    width: "100%",
    marginTop: "15px",
  },
  inputButton: {
    width: "48%",
    padding: "12px 0",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#0077cc",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default SignUp;
