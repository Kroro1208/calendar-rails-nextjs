import client from "./client"
import Cookies from "js-cookie";
import axios from 'axios';

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
interface UserData {
    id: string;
    name: string;
    email: string;
}

const getAuthHeaders = () => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if (!accessToken || !clientToken || !uid) {
        throw new Error("認証情報が見つかりません");
    }

    return {
        "access-token": accessToken,
        "client": clientToken,
        "uid": uid
    };
};

export const signUp = async (params: SignUpParams) => {
    try {
        const response = await client.post("/auth", { registration: params });
        if (response.data.status === 'success') {
            await createSession(response.data.data);
        }
        return response;
    } catch (error) {
        console.error("サインアップエラー:", error);
        throw error;
    }
};

export const signIn = async (params: SignInParams) => {
    try {
        const response = await client.post("/auth/sign_in", params);
        if (response.data.data) {
            await createSession(response.data.data);
        }
        return response;
    } catch (error) {
        console.error("サインインエラー:", error);
        throw error;
    }
}

export const signOut = async() => {
    try {
        await client.delete("/auth/sign_out", {
            headers: getAuthHeaders()
        });
        await deleteSession();
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        Cookies.remove("sessionId"); // セッションIDも削除する
    } catch (error) {
        console.error("サインアウトエラー:", error);
        throw error;
    }
}

export const getUser = async () => {
    const sessionId = Cookies.get("sessionId");
    if (!sessionId) {
        console.error("セッションIDが見つかりません");
        throw new Error("セッションIDが見つかりません");
    }
    try {
        const response = await axios.get('/lib/api/session', { 
            params: { sessionId },
            validateStatus: (status) => status < 500
        });
        if (response.status !== 200) {
            throw new Error(`ユーザー情報取得エラー: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error("サインインエラー:", error);
        throw error;
    }
}

export const createSession = async (userData: UserData) => {
    try {
        const response = await axios.post('/lib/api/session', { userData });
        if (!response?.data?.sessionId) {
            console.error("セッションIDが返されませんでした", response.data);
            throw new Error("セッションIDが返されませんでした");
        }
        Cookies.set("sessionId", response.data.sessionId);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteSession = async () => {
    const sessionId = Cookies.get("sessionId");
    if (sessionId) {
        try {
            await axios.delete('/lib/api/session', { params: { sessionId } });
            Cookies.remove("sessionId");
        } catch (error) {
            console.error("セッション削除エラー:", error);
            throw error;
        }
    }
}