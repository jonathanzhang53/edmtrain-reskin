import { useState, useEffect } from 'react';
import Event, {Artist, Venue} from '../models/Event';

const useFetchEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const API_KEY = process.env.REACT_APP_API_KEY;
      try {
        const response = await fetch(`${API_URL}?client=${API_KEY}`);
        const data = await response.json();
        if (data.success) {
          const transformedEvents = data.data.map(eventData => {
            // Preprocess venue data
            const venueData = {
              name: eventData.venue.name,
              location: eventData.venue.location,
              address: eventData.venue.address,
              state: eventData.venue.state,
              latitude: eventData.venue.latitude,
              longitude: eventData.venue.longitude
            };

            // Preprocess artist list
            const artistListData = eventData.artistList.map(artistData => {
              return new Artist({ name: artistData.name });
            });

            return new Event(
              eventData.ages,
              eventData.date,
              eventData.startTime,
              eventData.endTime,
              new Venue(venueData),
              artistListData
            );
          });

          console.log(transformedEvents);

          setEvents(transformedEvents);
        } else {
          setError('API request failed: ' + data.message);
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { events, isLoading, error };
};

export default useFetchEvents;
