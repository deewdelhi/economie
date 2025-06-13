import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserID } from "../../util/auth";
import { User } from "../../models/User";
import { Event } from "../../models/Event";
import EventDetailsForm from "../EventsComponent/eventDetailsForm.tsx"; // adjust path
import { getAuthToken } from "../../util/auth";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const overlayColor = "rgba(135, 206, 250, 0.8)";
  const darkOverlay = "rgba(107, 107, 107, 0.8)";
  const combinedBackground = `linear-gradient(135deg, ${overlayColor}, ${darkOverlay})`;

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleUpdateProfile = () => {
    navigate("/userUpdate");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `token ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data: User = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await fetch("http://127.0.0.1:8000/events/", {
          method: "GET",
          headers: {
            Authorization: `token ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch events");

        const allEvents: Event[] = await response.json();
        const filteredEvents = allEvents.filter((event) => event.creator == userId);
        setUserEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUserData();
    fetchEvents();
  }, []);

  if (!userData) {
    return (
      <div
        style={{
          padding: 20,
          textAlign: "center",
          background: combinedBackground,
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>User Profile</h1>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 480,
        margin: "40px auto",
        borderRadius: 12,
        background: combinedBackground,
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        color: "#fff",
        position: "relative",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: "700", marginBottom: 24, color: "#d3f1ff" }}>
        User Profile
      </h1>

      {[
        { label: "Username", value: userData.username },
        { label: "Email", value: userData.email },
        { label: "First Name", value: userData.first_name },
        { label: "Last Name", value: userData.last_name },
        { label: "Description", value: userData.description },
        { label: "Rating", value: userData.rating },
        { label: "Role", value: userData.role },
        {
          label: "Date Joined",
          value: new Date(userData.date_joined).toLocaleDateString(),
        },
        { label: "Date of Birth", value: userData.date_of_birth },
        {
          label: "Skills",
          value: userData.skills.length > 0 ? userData.skills.join(", ") : "No skills listed",
        },
        {
          label: "Preferences",
          value:
            userData.preferences.length > 0
              ? userData.preferences.join(", ")
              : "No preferences listed",
        },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            marginBottom: 12,
            fontSize: 16,
            lineHeight: 1.4,
            color: "#f0f9ff",
          }}
        >
          <strong style={{ color: "#a9d6ff" }}>{label}:</strong> {value}
        </div>
      ))}

      <div style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#a9d6ff" }}>
          My Events
        </h2>
        {userEvents.length === 0 ? (
          <p style={{ color: "#ddd" }}>No events created by you.</p>
        ) : (
          <ul style={{ listStyle: "disc inside", paddingLeft: 0, color: "#e0f0ff" }}>
            {userEvents.map((event) => (
              <li key={event.id} style={{ marginBottom: 12 }}>
                <span
                  onClick={() => openEventDetails(event)}
                  style={{
                    color: "#87cefa",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 600,
                    display: "inline-block",
                    maxWidth: "100%",
                    overflowWrap: "break-word",
                  }}
                >
                  <strong>{event.name}</strong> –{" "}
                  {new Date(event.starting_date).toLocaleDateString()}
                  <br />
                  <span style={{ color: "#c0cbd4", fontSize: 14 }}>{event.location}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpdateProfile}
        style={{
          marginTop: 32,
          width: "100%",
          padding: "12px 0",
          borderRadius: 8,
          backgroundColor: "#87cefa",
          border: "none",
          color: "#0d1a26",
          fontWeight: "700",
          fontSize: 18,
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#69b3d9")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#87cefa")}
      >
        Update Profile
      </button>

      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 12,
              padding: 20,
              maxWidth: 480,
              width: "90%",
              position: "relative",
              color: "#fff",
            }}
          >
            <button
              onClick={closeEventDetails}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: "#a9b8cc",
                fontSize: 24,
                cursor: "pointer",
              }}
              aria-label="Close Event Details"
            >
              ✕
            </button>
            <EventDetailsForm eventDetail={selectedEvent} onClose={closeEventDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
