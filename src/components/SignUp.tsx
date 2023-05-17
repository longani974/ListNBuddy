import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSignUp from "../hooks/useSignUp";

type SignUpProps = {
    // props
};

export interface SignUpFormInput {
    username: string;
    email: string;
    password: string;
}

const SignUp: React.FC<SignUpProps> = () => {
    const { register, handleSubmit, reset } = useForm<SignUpFormInput>();
    const {
        mutate: signUp,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useSignUp();
    const onSubmit: SubmitHandler<SignUpFormInput> = (data) => {
        signUp(data);
        isSuccess && reset();
        isError && console.log("error" + error);
    };

    return (
        <form
            className="flex flex-col w-80 gap-4 m-auto mt-10"
            onSubmit={handleSubmit(onSubmit)}
        >
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                className="input input-bordered w-full max-w-xs"
                {...register("username")}
            />
            <input
                type="email"
                placeholder="Adresse e-mail"
                className="input input-bordered w-full max-w-xs"
                {...register("email")}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                className="input input-bordered w-full max-w-xs"
                {...register("password")}
            />
            <button
                type="submit"
                className={`btn btn-primary ${
                    isLoading && "loading disabled"
                } `}
            >
                Créer un compte
            </button>
        </form>
    );
};
export default SignUp;
