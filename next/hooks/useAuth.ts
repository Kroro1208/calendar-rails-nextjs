import { getUser, signIn, signOut, signUp } from "@/app/lib/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const clearAuthCookies = () => {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        Cookies.remove("sessionId");
    };

    const cleanUserQuery= () => {
        queryClient.removeQueries({ queryKey: ["user"] }); // キャッシュからユーザー情報を削除
        queryClient.setQueryData(["user"], null); //　"user" キーのクエリデータを null に設定
    }

    const {
        data: user,
        isPending: isCheckingAuth,
        error: userError,
    } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const userData = await getUser();
                if(!userData) {
                    throw new Error('ユーザーが見つかりません')
                }
                return userData;
            } catch (error) {
                clearAuthCookies();
                throw error;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    });

    const loginMutation = useMutation({
        mutationFn: signIn,
        onSuccess: async (data) => {
            const { headers } = data;
            Cookies.set("_access_token", headers["access-token"]);
            Cookies.set("_client", headers.client);
            Cookies.set("_uid", headers.uid);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.push("/calendar");
        }
    });

    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: async (data) => {
            if(data.data.status === "success") {
                const { headers } = data;
                Cookies.set("_access_token", headers["access-token"]);
                Cookies.set("_client", headers.client);
                Cookies.set("_uid", headers.uid);
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                router.push("/calendar");
            }
        }
    });

    const signOutMutation = useMutation({
        mutationFn: async () => {
            try {
                await signOut();
                clearAuthCookies(); // 認証関連のクッキーを削除
                cleanUserQuery()
                router.push("/");
            } catch (error) {
                clearAuthCookies();
                cleanUserQuery();
                router.push("/");
                throw error;
            }
        }
    });

    console.log(user)

    return {
        login: loginMutation.mutate,
        isLogginIn: loginMutation.isPending,
        loginError: loginMutation.error,
        signUp: signUpMutation.mutate,
        isSignUpPending: signUpMutation.isPending,
        isSignUpError: signUpMutation.error,
        signOut: signOutMutation.mutate,
        isSignOutPending: signOutMutation.isPending,
        user: user,
        isCheckingAuth,
        userError,
    };
}