import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { SignUpFormInput } from "../components/SignUp";
import useSignIn from "./useSignIn";

export default function useSignUP() {
    const { mutate: signIn } = useSignIn();
    async function signUp({ username, email, password }: SignUpFormInput) {
        await pb
            .collection("users")
            .create({ username, email, password, passwordConfirm: password })
            .then(() => {
                signIn({ email, password });
            });
    }

    return useMutation(signUp);
}
