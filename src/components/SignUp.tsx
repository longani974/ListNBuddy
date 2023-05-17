import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type SignUpProps = {
    // props
};

interface IFormInput {
    username: string;
    email: string;
    password: string;
}

const SignUp: React.FC<SignUpProps> = () => {
    const { register, handleSubmit } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

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
            <button type="submit" className="btn btn-primary">
                Créer un compte
            </button>
        </form>
    );
};
export default SignUp;
