import { BASE_ENDPOINT } from "./config";

export const makeRequest = (uri, absoluteUri = false, method = "GET", body) => {
    return fetch(absoluteUri ? uri : BASE_ENDPOINT + uri, {
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        }),
    });
};
