export const CLIENT_ID = "7c63549bc99a422ea4887abe8f222015";
export const CLIENT_SECRET = "018af3322c3f4d0b8d8bce8624c94126";
export const BASE_ENDPOINT = "https://api.spotify.com/v1";
export const AUTH_ENDPOINT = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${encodeURI(
    "user-top-read user-read-private user-read-playback-state user-modify-playback-state"
)}&redirect_uri=http://localhost:3000/auth`;

export const font = { fontFamily: "Montserrat" };
