"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import SignUpImg from "../../../public/Mobile login-pana.png";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/app/Loading";
import { type SubmitHandler, useForm } from "react-hook-form";

type FormInputData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

const SignUpPage = () => {
    const router = useRouter();
    const { signUp, isSignUpPending, isSignUpError, user, isCheckingAuth } = useAuth();
    const {register, handleSubmit, formState: { errors }, watch } = useForm<FormInputData>();
    const password = watch("password");

    useEffect(() => {
        if(user) return router.push("/calendar");
    }, [user, router]);

    const onSubmit: SubmitHandler<FormInputData> = (data) => {
        signUp({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.passwordConfirmation
        });
    }

    if(isCheckingAuth) {
        return <Loading />
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            {isSignUpError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{isSignUpError.message}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">名前</Label>
                                <Input
                                    {...register("name", { required: "名前は必須です" })}
                                    id="name" type="text" placeholder="名前を入力" />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                {...register("email", {
                                    required: "メールアドレスは必須です",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "無効なメールアドレスです"
                                    }
                                })}
                                    id="email" type="email" placeholder="メールアドレスを入力" />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <Input
                                {...register("password", {
                                    required: "パスワードは必須です",
                                    minLength: {
                                        value: 6,
                                        message: "最低6文字以上で入力してください"
                                    }
                                })}
                                    id="password" type="password" />
                                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">パスワード（確認）</Label>
                                <Input
                                    {...register("passwordConfirmation", {
                                        required: "パスワード確認は必須です",
                                        validate: value => value === password || "パスワードが一致しません"
                                    })}
                                    id="confirm-password" type="password" required />
                                    {errors.passwordConfirmation && <span className="text-red-500 text-sm">{errors.passwordConfirmation.message}</span>}

                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isSignUpPending}>
                                {isSignUpPending ? "登録中..." : "登録する"}
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