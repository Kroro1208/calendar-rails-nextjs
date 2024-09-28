"use client"
import Image from "next/image";
import HomeImg from "../public/Timeline-bro.png";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { useAuth } from "@/hooks/useAuth";
import { type SubmitHandler, useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Home() {
  const router = useRouter();
  const { login, isLogginIn, loginError, user, isCheckingAuth } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  useEffect(() => {
    if (user) {
      router.push("/calendar");
    }
  }, [router, user]);

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login(data)
  }

  if (isCheckingAuth) return <Loading />;

  if(user) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
        <div className="max-w-md text-center">
          <Image src={HomeImg} alt="homeImg" width={400} height={400} className="mx-auto" />
          <h1 className="mt-6 font-mono text-3xl font-bold text-gray-800">NextRails Calendar App</h1>
        </div>
      </div>
      <div className="m-auto flex w-full max-w-5xl items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
            <CardDescription className="text-center">
              NextRails Calendar App へようこそ
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...register("email", {
                    required: "メールアドレスは必須です",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "無効なアドレスの形式です"
                    }
                  })}
                  type="email" placeholder="メールアドレス" />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
              <div className="space-y-2">
                <Input
                  {...register("password", {
                    required: "パスワードは必須です",
                    minLength: {
                      value: 6,
                      message: "最低6文字以上で入力してください"
                    }
                  })}
                  type="password" placeholder="パスワード" />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>
              {loginError && (
                <div className="text-red-500 text-sm">{loginError.message || "ログイン中にエラーが発生しました"}</div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" disabled={isLogginIn} className="w-full">
                {isLogginIn ? "ログイン中..." : "ログインする"}
              </Button>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span>アカウント登録はこちら</span>
                <ArrowRight size={16} className="ml-1"/>
                <Link 
                  href="/signup" 
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <span>ユーザー登録</span>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}