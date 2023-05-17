import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { signInFormInput } from "../components/SignIn";

export default function useSignIn() {
    async function signIn({ email, password }:signInFormInput) {
        await pb
            .collection("users")
            .authWithPassword(email, password);
    }

    return useMutation(signIn);
}
