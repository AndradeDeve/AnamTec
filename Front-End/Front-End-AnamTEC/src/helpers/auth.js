import { jwtDecode } from "jwt-decode";

function getUser() {
    const token = localStorage.getItem("token");

    if(!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded;
    }catch(err){
        console.log(err);
        return null;
    }

}
function isAutenticated() {
    return !!getUser();
}
export {isAutenticated, getUser}