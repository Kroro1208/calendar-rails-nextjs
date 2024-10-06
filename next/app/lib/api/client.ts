import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
    ignoreHeaders: true // ヘッダーの名前の変換を無視
};

const client = applyCaseMiddleware(
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
        // クロスオリジンリクエスト時にクッキーや認証ヘッダーを含めることを許可。
        // これにより、異なるドメイン間でのセッション(NextとRails)管理や認証が可能。
        withCredentials: true 
    }),
    options
);

export default client;