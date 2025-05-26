import { CSSProperties, useState } from "react";
import { getAuthToken } from "../../util/auth";
import EventDetailsForm from "./eventDetailsForm";

const DeleteEvent = (props: { eventToDelete: any }) => {
    const [shouldShow, setShouldShow] = useState<number>(1);

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        console.log(" about to delete this");
        console.log(props.eventToDelete.id);
        // const [shouldShow, setShouldShow] = useState<number>(1);

        fetch(`http://127.0.0.1:8000/events/${props.eventToDelete.id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        })
            .then((response) => {
                response.json();
                console.log(response);
            })
            .then((data) => {
                console.log(data);
            });
        setTimeout(() => {
            const isUserEventPage =
                window.location.href.includes("/userEvents");

            if (isUserEventPage) {
                window.location.href = `/userEvents/`;
            } else {
                window.location.href = `/showlist/`;
            }
            //setShouldShow(0);
        }, 500);
    };

    const handleCancel = () => {
        const isUserEventPage = window.location.href.includes("/userEvents");

        if (isUserEventPage) {
            window.location.href = `/userEvents/`;
        } else {
            window.location.href = `/showlist/`;
        }
        //setShouldShow(0);
        // <EventDetailsForm eventDetail={props.eventToDelete} />;
    };

    if (shouldShow == 1) {
        return (
            <div id="dialog-content">
                <p>Are you sure you want to delete this item?</p>
                <div id="buttons-container">
                    <button style={styles.inputButton} onClick={handleDelete}>
                        Yes
                    </button>
                    <button style={styles.inputButton} onClick={handleCancel}>
                        I am a COWARD
                    </button>
                </div>
            </div>
        );
    } else {
        return;
    }
};

const styles: { [key: string]: CSSProperties } = {
    inputButton: {
        backgroundColor: "#ecb753", // Dark yellow button color
        color: "#333333", // Dark gray text color
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "20px",
        marginLeft: "20px",
    },
};

export default DeleteEvent;