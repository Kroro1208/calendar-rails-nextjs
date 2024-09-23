import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import SignUpImg from "../../../public/Mobile login-pana.png"
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const SignUpPage = () => {
//   const [error, setError] = useState('');

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
          <form>
            <CardContent className="space-y-4">
            {/* {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )} */}
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" type="text" placeholder="山田 太郎" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" placeholder="taro@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">パスワード（確認）</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">登録する</Button>
              <div className="text-center text-sm">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-blue-500 hover:underline">
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