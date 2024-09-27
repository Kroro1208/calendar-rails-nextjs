import { createSession, getUser, signIn, signOut, signUp } from "@/app/lib/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: user,
        isPending: isCheckingAuth,
        error: userError,
        refetch: refetchUser
    } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: false
    });

    if(userError) {
        Cookies.remove("sessionId");
    }

    const loginMutation = useMutation({
        mutationFn: signIn,
        onSuccess: async (data) => {
            const { headers } = data;
            Cookies.set("_access_token", headers["access-token"]);
            Cookies.set("_client", headers.client);
            Cookies.set("_uid", headers.uid);
            await createSession(data.data);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    });

    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: async (data) => {
            if(data.data.status === "success") {
                await createSession(data.data.data);
                queryClient.invalidateQueries({ queryKey: ["user"] });
                router.push("/calendar");
            }
        }
    });

    const signOutMutation = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            queryClient.removeQueries({  queryKey: ["user"] });
            router.push("/");
        }
    });

    return {
        login: loginMutation.mutate,
        isLogginIn: loginMutation.isPending,
        loginError: loginMutation.error,
        signUp: signUpMutation.mutate,
        isSignUpPending: signUpMutation.isPending,
        isSignUpError: signUpMutation.error,
        signOut: signOutMutation.mutate,
        isSignOutPending: signOutMutation.isPending,
        user,
        isCheckingAuth,
        userError,
        refetchUser
    };
}