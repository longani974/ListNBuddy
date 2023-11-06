import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import { useClickModal } from "../hooks/useClickModal";

type ModalForgetPasswordProps = {
    // props
};

type Stape = "passwordForget" | "newPassword";

// export interface signInFormInput {
//     email: string;
//     password: string;
// }

const ModalForgetPassword: React.FC<ModalForgetPasswordProps> = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [token, setToken] = useState("");
    const [stape, setStape] = useState<Stape>("passwordForget");

    const { clickModal } = useClickModal();

    //TODO: A custom hook to get URLSearchParams like in App.tsx
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenNewPassword = urlParams.get("newPassword");
        if (tokenNewPassword) {
            setStape("newPassword");
            setToken(tokenNewPassword);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await pb
            .collection("users")
            .requestPasswordReset(email)
            .then(() => {
                setStape("newPassword");
            });
    };

    const handleChangePassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        await pb
            .collection("users")
            .confirmPasswordReset(token, newPassword, confirmNewPassword)
            .then(() => {
                clickModal("modalForgetPassword");
            });
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <>
                <input
                    type="checkbox"
                    id="modalForgetPassword"
                    className="modal-toggle"
                />
                <div className="modal">
                    <div className="modal-box relative">
                        <label
                            htmlFor="modalForgetPassword"
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => setStape("passwordForget")}
                        >
                            ✕
                        </label>
                        <h3 className="text-lg font-bold">
                            {stape === "passwordForget"
                                ? "Mot de passe oublié"
                                : "Nouveau mot de passe"}
                        </h3>
                        {stape === "passwordForget" && (
                            <form
                                className="flex flex-col w-80 gap-4 m-auto mt-10"
                                onSubmit={(e) => handleSubmit(e)}
                            >
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className={`btn btn-primary`}
                                >
                                    Demande de réinitialisation
                                </button>
                            </form>
                        )}
                        {stape === "newPassword" && (
                            <form
                                className="flex flex-col w-80 gap-4 m-auto mt-10"
                                onSubmit={(e) => handleChangePassword(e)}
                            >
                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={(e) =>
                                        setConfirmNewPassword(e.target.value)
                                    }
                                />
                                {/* <input
                                    type="text"
                                    placeholder="Ticket de vérification"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={(e) => setToken(e.target.value)}
                                /> */}
                                <button
                                    type="submit"
                                    className={`btn btn-primary`}
                                >
                                    Changer Mot de passe
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </>
        </>
    );
};
export default ModalForgetPassword;
