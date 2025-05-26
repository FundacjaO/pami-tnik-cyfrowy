import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
// Fix swapped credentials
const CLIENT_ID = '255294775729-7n9udt134iujd5f6fej0ovf6e7fnj036.apps.googleusercontent.com';
const API_KEY = 'AIzaSyArTtihFnYGx5xbqHOkMvbSugzYTdQ0aYM';

export default function GoogleCalendar() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Add missing events state
  const [events, setEvents] = useState([]);

  // Initialize Google API
  useEffect(() => {
    const loadGoogleAPI = async () => {
      try {
        // Load the Google API script
        await new Promise((resolve) => {
          gapi.load('client:auth2', resolve);
        });

        // Initialize the client
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        });

        setIsInitialized(true);

        // Check if already signed in
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
          await listUpcomingEvents();
        }
      } catch (err) {
        setError(`Initialization error: ${err.message}`);
        console.error('Failed to initialize Google API:', err);
      }
    };

    loadGoogleAPI();
  }, []);

  const handleAuthClick = async () => {
    try {
      if (!gapi.auth2) {
        setError('Google Auth not initialized');
        return;
      }

      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.signIn();
      await listUpcomingEvents();
    } catch (err) {
      setError(`Authentication error: ${err.message}`);
      console.error('Authentication failed:', err);
    }
  };

  const listUpcomingEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      setEvents(response.result.items);
    } catch (err) {
      setError(`Failed to fetch events: ${err.message}`);
      console.error('Failed to fetch events:', err);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (error) {
    return (
      <div className="text-red-500 text-sm p-2">
        Wystąpił błąd: {error}
      </div>
    );
  }

  return (
    <div className="calendar-widget space-y-4">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="rounded-lg border-0 shadow-sm w-full"
      />
      
      {!isInitialized ? (
        <button
          disabled
          className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg"
        >
          Inicjalizacja kalendarza...
        </button>
      ) : (
        <button
          onClick={handleAuthClick}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 
                   text-white rounded-lg transition-colors"
        >
          {events.length > 0 ? 'Odśwież wydarzenia' : 'Zaloguj do Google Calendar'}
        </button>
      )}

      {events.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Wydarzenia na {selectedDate.toLocaleDateString()}</h3>
          <ul className="space-y-2">
            {events.map((event) => (
              <li 
                key={event.id}
                className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg 
                         text-sm text-gray-700 dark:text-gray-200"
              >
                {event.summary}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}