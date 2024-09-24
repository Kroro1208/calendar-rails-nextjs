import client from "./client"
import Cookies from "js-cookie";

interface SignUpParams {
    name: string
    email: string;
    password: string;
    password_confirmation: string;
}

interface SignInParams {
    email: string;
    password: string;
}

export const signUp = (params: SignUpParams) => {
    return client.post("/auth", { registration: params });
};

export const signIn = (params: SignInParams) => {
    return client.post("/auth/sign_in", params)
}

export const getUser = () => {
    const accessToken= Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid){
        throw new Error ("認証されていないユーザーです");
    }
    
    return client.get("/auth/sessions", {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    })
}