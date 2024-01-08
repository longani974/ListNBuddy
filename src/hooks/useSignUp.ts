import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { SignUpFormInput } from "../components/SignUp";
import useSignIn from "./useSignIn";
import { ClientResponseError } from "pocketbase";
import { Users } from "../atoms/invitationAtoms";

export default function useSignUP() {
    const { mutate: signIn } = useSignIn();
    async function signUp({
        username,
        email,
        password,
    }: SignUpFormInput): Promise<Users> {
        console.log(username)
        console.log(email)
        console.log(password)
        const userData = await pb.collection("users").create({
            username,
            email,
            password,
            passwordConfirm: password,
            emailVisibility: true,
        });
        await signIn({ email, password }); // Sign in the user after successful signup
        return userData as Users;
    }

    return useMutation<Users, ClientResponseError, SignUpFormInput>(signUp, {
        onError: (err) => {
            return err
        },
    });
}