import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { signInFormInput } from "../components/SignIn";
import { useAfterSignInFlow } from "./useAfterSignInFlow";

export default function useSignIn() {


    const afterSignInFlow = useAfterSignInFlow();

    async function signIn({ email, password }: signInFormInput) {
        const userData = await pb
            .collection("users")
            .authWithPassword(email, password);

        return userData;
    }

    return useMutation(signIn, {
        onSuccess: () => {
            afterSignInFlow();
        },
    });
}
