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

export const signOut = async() => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    if(!accessToken || !clientToken || uid) {
        throw new Error("ユーザーはすでにログアウト済みです");
    }

    try {
        await client.delete("/auth/sign_out", {
            headers: {
                "access-token": accessToken,
                "client": clientToken,
                "uid": uid
            }
        });
        // ログアウト成功後
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
    } catch (error) {
        console.log(error);
    }
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