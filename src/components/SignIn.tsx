import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSignIn from "../hooks/useSignIn";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { mixed, string, number, date, boolean, object, array } from "../utils/yupTranslate"; // Remplacez './yourLocaleFile' par le chemin vers votre fichier de traduction
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
  array: array
});

type SignInProps = {
    // props
};

const schema = yup
    .object({
        email: yup.string().email().required().label('Votre adresse e-mail'),
        password: yup.string().min(8).max(20).required().label('Votre mot de passe')
    })
    .required();
type FormData = yup.InferType<typeof schema>;

export interface signInFormInput {
    email: string;
    password: string;
}

const SignIn: React.FC<SignInProps> = () => {
    const {
        mutate: signIn,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useSignIn();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    const [{ authMode }, setAuthFormState] = useRecoilState(authFormState);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        await signIn(data);
        isSuccess && reset();
        isError && console.log(error);
    };

    return (
        <>
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
                    type="email"
                    placeholder="Adresse e-mail"
                    className="input input-bordered w-full max-w-xs"
                    {...register("email", { required: true })}
                />
                <FormErrorMsg messageError={errors.email?.message} />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full max-w-xs"
                    {...register("password", { required: true })}
                />
                <FormErrorMsg messageError={errors.password?.message} />

                <button
                    type="submit"
                    className={`btn btn-primary ${
                        isLoading && "loading disabled"
                    } `}
                >
                    Se connecter
                </button>
            </form>
            <div className="mt-8">
                <label
                    className="link link-hover"
                    htmlFor="modalForgetPassword"
                >
                    Mot de passe oublié
                </label>
            </div>
        </>
    );
};
export default SignIn;
