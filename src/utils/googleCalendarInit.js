import { gapi } from 'gapi-script';

export const initGoogleCalendarAPI = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
          ],
          scope: 'https://www.googleapis.com/auth/calendar'
        })
        .then(() => {
          resolve(gapi);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};