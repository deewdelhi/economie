export function getAuthToken() {
    const token = localStorage.getItem("token");
    return token;
}

export function getUsername() {
    const username = localStorage.getItem("username");
    return username;
}

export function getUserID() {
    const userID = localStorage.getItem("userID");
    return userID;
}

export function getUserRole() {
    const userR = localStorage.getItem("userRole");
    return userR;
}