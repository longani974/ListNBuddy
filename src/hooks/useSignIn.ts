import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { signInFormInput } from "../components/SignIn";
import { useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";

export default function useSignIn() {
    const setUserState = useSetRecoilState(userState);

    async function signIn({ email, password }: signInFormInput) {
        await pb
            .collection("users")
            .authWithPassword(email, password)
            .then(() => {
                pb.authStore.isValid && setUserState({ isLogin: true });
            });
    }

    return useMutation(signIn);
}
