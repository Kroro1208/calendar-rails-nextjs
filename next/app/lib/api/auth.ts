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

const getAuthHeaders = () => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if (!accessToken || !clientToken || !uid) {
        throw new Error("認証エラーです");
    }

    return {
        "access-token": accessToken,
        "client": clientToken,
        "uid": uid
    };
};

export const signUp = (params: SignUpParams) => {
    return client.post("/auth", { registration: params });
};

export const signIn = (params: SignInParams) => {
    return client.post("/auth/sign_in", params)
}

export const signOut = async() => {
    try {
        await client.delete("/auth/sign_out", {
            headers: getAuthHeaders()
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
    return client.get("/auth/sessions", {
        headers: getAuthHeaders()
    }).then(response => {
        const userData = response.data.data;
        return {
            isLogin: true,
            name: userData.name
        }
    })
}