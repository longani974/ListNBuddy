import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSignUp from "../hooks/useSignUp";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    mixed,
    string,
    number,
    date,
    boolean,
    object,
    array,
} from "../utils/yupTranslate"; // Remplacez './yourLocaleFile' par le chemin vers votre fichier de traduction
import FormErrorMsg from "./FormErrorMsg";
import { useRecoilState } from "recoil";
import { authFormState } from "../atoms/showAuthFormAtoms";

yup.setLocale({
    mixed: mixed,
    string: string,
    number: number,
    date: date,
    boolean: boolean,
    object: object,
    array: array,
});

type SignUpProps = {
    // props
};
const schema = yup
    .object({
        username: yup
            .string()
            .required()
            .min(3)
            .max(100)
            .label("Votre nom d'utilisateur"),
        email: yup.string().email().required().label("Votre adresse e-mail"),
        password: yup
            .string()
            .min(8)
            .max(20)
            .required()
            .label("Votre mot de passe"),
    })
    .required();
type FormData = yup.InferType<typeof schema>;
export interface SignUpFormInput {
    username: string;
    email: string;
    password: string;
}

const SignUp: React.FC<SignUpProps> = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    const {
        mutate: signUp,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useSignUp();

    const [{ authMode }, setAuthFormState] = useRecoilState(authFormState);

    const onSubmit: SubmitHandler<FormData> = (data) => {
        signUp(data);
        isSuccess && reset();
        isError &&
            console.log(
                error.response.data.email.code === "validation_is_email"
            );
    };
    useEffect(() => {
        if (isSuccess) {
            setAuthFormState({ showAuthForm: false, authMode });
            reset();
        }
        if (
            isError &&
            error?.response.data.email.code === "validation_is_email"
        ) {
            setError("email", { message: "Email non valide." });
        } else if (
            isError
        ) {
            setError("email", { message: "Oops... Un problème est survenue." });
        }
    }, [authMode, error?.response.data.email.code, isError, isSuccess, reset, setAuthFormState, setError]);

    return (
        <form
            className="flex flex-col w-80 gap-4 m-auto mt-10 relative"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label
                    onClick={() => setAuthFormState({ showAuthForm: false, authMode })}
                    className="btn btn-sm btn-circle btn-primary absolute -right-0 -top-10
                "
                >
                    ✕
                </label>
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                className="input input-bordered w-full max-w-xs"
                {...register("username")}
            />
            <FormErrorMsg messageError={errors.username?.message} />
            <input
                type="email"
                placeholder="Adresse e-mail"
                className="input input-bordered w-full max-w-xs"
                {...register("email")}
            />
            {/* TODO: errase the msg after error?.response.data.email.code . It is confuse when typing a valid email and the msg still here */}
            <FormErrorMsg messageError={errors.email?.message} />
            <input
                type="password"
                placeholder="Mot de passe"
                className="input input-bordered w-full max-w-xs"
                {...register("password")}
            />
            <FormErrorMsg messageError={errors.password?.message} />
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
