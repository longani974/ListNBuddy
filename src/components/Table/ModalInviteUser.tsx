import React, { useEffect } from "react";
// import { Article } from "../../types/dbPocketbasetypes";
import { useInvitateUser } from "../../hooks/useInvitateUser";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";
import { useRecoilValue } from "recoil";
import { SubmitHandler, useForm } from "react-hook-form";
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
} from "../../utils/yupTranslate"; // Remplacez './yourLocaleFile' par le chemin vers votre fichier de traduction
import FormErrorMsg from "../FormErrorMsg";
import { userState } from "../../atoms/userAtoms";
import AuthButtons from "../AuthButtons";
// Set yup locale for validation error messages
// We use the yupTranslate file to translate the error messages
yup.setLocale({
    mixed: mixed,
    string: string,
    number: number,
    date: date,
    boolean: boolean,
    object: object,
    array: array,
});

// Define the yup schema for form validation
const schema = yup
    .object({
        email: yup.string().email().required().label("Adresse e-mail"),
    })
    .required();

// Define the type of the form data (used by react-hook-form) from the yup schema
type FormData = yup.InferType<typeof schema>;

type ModalInviteUserProps = {
    listId: string;
};

const ModalInviteUser: React.FC<ModalInviteUserProps> = ({ listId }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm<FormData>({ resolver: yupResolver<FormData>(schema) });

    const {
        mutateAsync: listModifier,
        isSuccess,
        isLoading,
        isError,
        error,
    } = useInvitateUser();

    const handleInviteUser: SubmitHandler<FormData> = (data) => {
        listModifier({ ...data, id: listId, status: "waiting" });
    };

    const isOnline = useRecoilValue(onlineStatusState);
    const { isLogin } = useRecoilValue(userState);

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
        if (isError) {
            setError("email", { message: (error as Error)?.message });
        }
    }, [error, isError, isSuccess, reset, setError]);

    return (
        <>
            <input
                type="checkbox"
                id="inviteUserModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="inviteUserModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Inviter une personne</h3>
                    {!isOnline && isLogin && (
                        <>
                            <div className="alert alert-error">
                                Vous êtes hors ligne, vous ne pouvez pas inviter
                                une personne.
                            </div>
                            <div className="py-4">
                                <form className="flex flex-col">
                                    <label className="label">
                                        <span className="label-text">
                                            Email de l'invité
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="input input-bordered w-100%"
                                        {...register("email")}

                                        // value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <FormErrorMsg
                                        messageError={errors.email?.message}
                                    />
                                </form>

                                <label
                                    htmlFor="inviteUserModal"
                                    className={`btn btn-primary mt-4 w-full ${
                                        (!isOnline || isLoading) &&
                                        "btn-disabled"
                                    }`}
                                    onClick={handleSubmit(handleInviteUser)}
                                >
                                    {isLoading && (
                                        <span className="loading loading-ring"></span>
                                    )}
                                    Inviter
                                </label>
                            </div>
                        </>
                    )}
                    {!isLogin && (
                        <>
                        <div className="alert alert-warning">
                            Vous devez être connecté pour inviter une personne.
                        </div>
                        <AuthButtons />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default ModalInviteUser;
