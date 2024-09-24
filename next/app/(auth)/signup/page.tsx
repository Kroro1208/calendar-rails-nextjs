"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import SignUpImg from "../../../public/Mobile login-pana.png";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import Cookies from "js-cookie";
import { signUp } from "@/app/lib/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await signUp({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            const accessToken = res.headers["access-token"];
            const clientToken = res.headers.client;
            const uid = res.headers.uid;
            if (accessToken && clientToken && uid) {
                Cookies.set("_access_token", accessToken);
                Cookies.set("_client", clientToken);
                Cookies.set("_uid", uid);
                router.push("/calendar");
            } else {
                setError("認証情報の取得に失敗しました");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRegister();
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
            <div className="m-auto flex w-full max-w-5xl items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">ユーザー登録</CardTitle>
                        <CardDescription className="text-center">
                            NextRails Calendar App へようこそ
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">名前</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="name" type="text" placeholder="名前を入力" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email" type="email" placeholder="taro@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">パスワード（確認）</Label>
                                <Input
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    id="confirm-password" type="password" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "登録中..." : "登録する"}
                            </Button>
                            <div className="text-center text-sm">
                                すでにアカウントをお持ちの方は
                                <Link href="/" className="text-blue-500 hover:underline">
                                    こちらからログイン
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
                <div className="max-w-md text-center">
                    <Image src={SignUpImg} alt="signUpImg" width={400} height={400} className="mx-auto" />
                    <h1 className="mt-6 font-mono text-3xl font-bold text-gray-800">NextRails Calendar App</h1>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;