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
// import FormErrorMsg from "../FormErrorMsg";
import { userState } from "../../atoms/userAtoms";
import AuthButtons from "../AuthButtons";
import { useClickModal } from "../../hooks/useClickModal";
// import { Adsense } from "@ctrl/react-adsense";
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

    const { clickModal:clickBtn } = useClickModal();

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
                    {isLogin && (
                        <>
                            {!isOnline && (
                                <div className="alert alert-error">
                                    Vous êtes hors ligne, vous ne pouvez pas
                                    inviter une personne.
                                </div>
                            )}
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
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                clickBtn("inviteUserbtn")
                                            }
                                        }}
                                        {...register("email")}

                                        // value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {/* <FormErrorMsg
                                        messageError={errors.email?.message}
                                    /> */}
                                </form>

                                {errors.email?.message ===
                                    "Pas d'utilisateur avec cette email" && (
                                    <div className="mt-6">
                                        <div className=" text-lg ">
                                            Oups, il n'y a pas d'utilisateur
                                            avec cette email. Voulez-vous
                                            l'inviter à utliser ListnBuddy ?
                                        </div>
                                        <a
                                            href="sms:?body=Salut%20!%20Rejoins-moi%20sur%20ListnBuddy%20pour%20partager%20nos%20listes%20de%20courses!%20Inscris-toi%20et%20envoie-moi%20ton%20e-mail%20pour%20que%20je%20puisse%20t'envoyer%20une%20invitation:%20https%3A%2F%2Fapp.listnbuddy.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary mt-4 w-full"
                                        >
                                            Inviter par SMS
                                        </a>
                                        <div>
                                            Votre invité devra avant tout créer
                                            un compte ListnBuddy pour pouvoir
                                            rejoindre votre liste. Nous avons
                                            écris un petit message pour vous,
                                            vous pouvez le modifier si vous le
                                            souhaitez.
                                        </div>
                                    </div>
                                )}

                                {errors.email?.message !==
                                    "Pas d'utilisateur avec cette email" && (
                                    <label
                                        htmlFor="inviteUserModal"
                                        id="inviteUserbtn"
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
                                )}
                            </div>
                        </>
                    )}
                    {!isLogin && (
                        <>
                            <div className="alert alert-warning">
                                Vous devez être connecté pour inviter une
                                personne.
                            </div>
                            <AuthButtons />
                        </>
                    )}
                    {/* <Adsense
                        slot="2212194431"
                        client="ca-pub-1943996794458760"
                        format="auto"
                    /> */}
                </div>
            </div>
        </>
    );
};
export default ModalInviteUser;
