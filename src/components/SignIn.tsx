import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSignIn from "../hooks/useSignIn";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { fr } from "yup-locales";
import { mixed, string, number, date, boolean, object, array } from "../utils/yupTranslate"; // Remplacez './yourLocaleFile' par le chemin vers votre fichier de traduction

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

// export interface signInFormInput {
//     email: string;
//     password: string;
// }

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
    const onSubmit: SubmitHandler<FormData> = (data) => {
        signIn(data);
        isSuccess && reset();
        isError && console.log(error);
    };

    return (
        <>
            <form
                className="flex flex-col w-80 gap-4 m-auto mt-10"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="email"
                    placeholder="Adresse e-mail"
                    className="input input-bordered w-full max-w-xs"
                    {...register("email", { required: true })}
                />
                <span className="text-red-500"> {errors.email?.message}</span>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full max-w-xs"
                    {...register("password", { required: true })}
                />
                <span className="text-red-500">
                    {errors.password?.message}
                </span>

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
