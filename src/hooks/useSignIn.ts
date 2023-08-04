import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { signInFormInput } from "../components/SignIn";
import { useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";

export default function useSignIn() {
    const setUserState = useSetRecoilState(userState);

    async function signIn({ email, password }: signInFormInput) {
        const userData = await pb
            .collection("users")
            .authWithPassword(email, password)

        return userData;
    }

    return useMutation(signIn, {
        onSuccess: () => {
            pb.authStore.isValid && setUserState({ isLogin: pb.authStore.isValid, userId: pb.authStore?.model?.id });
        }
    });
}
