import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import EventDetailsForm from "./EventDetailsForm";
import {getAuthToken} from "../../util/auth.tsx";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [eventDetail, setEventDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${id}/?format=json`, {
          headers: {
            'Authorization': `token ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEventDetail(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetail();
  }, [id]);

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <EventDetailsForm eventDetail={eventDetail} onClose={() => window.history.back()} />
  );
};

export default EventDetailsPage;
