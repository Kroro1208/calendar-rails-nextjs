import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
    ignoreHeaders: true // ヘッダーの名前の変換を無視
};

const client = applyCaseMiddleware(
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
        withCredentials: true 
    }),
    options
);

export default client;