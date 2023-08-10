import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import { Lists } from "../../types/dbPocketbasetypes";
import { useInvitateUser } from "../../hooks/useInvitateUser";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms/userAtoms";
import { listToShow } from "../../atoms/listToShow";
import useInvitations from "../../hooks/useInvitations";
import { useMutation } from "@tanstack/react-query";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";
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
import { useClickModal } from "../../hooks/useClickModal";

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
        listName: yup
            .string()
            .min(2)
            .max(50)
            .required()
            .label("Le nom de la liste"),
    })
    .required();

// Define the type of the form data (used by react-hook-form) from the yup schema
type FormData = yup.InferType<typeof schema>;

type ModalMyNewListProps = {
    //
};

const createList = async ({
    listName,
    userId,
}: {
    listName: string;
    userId: string | undefined;
}) => {
    // example create data
    const data = {
        name: listName,
        createBy: userId,
    };

    const recordList = await pb.collection("lists").create(data);
    return recordList as Lists;
};

const ModalMyNewList: React.FC<ModalMyNewListProps> = () => {
    const [idList, setIdList] = useState<string>("");
    const { userId } = useRecoilValue(userState);

    const { clickModal } = useClickModal();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver<FormData>(schema) });

    const setIndexListToShow = useSetRecoilState(listToShow);

    const inviteUser = useInvitateUser();

    const acceptInvitations = useInvitations("accept");

    const isOnline = useRecoilValue(onlineStatusState);

    useEffect(() => {
        const index = acceptInvitations.findIndex(
            (invitation) => invitation.list === idList
        );
        if (index > -1) {
            setIndexListToShow({
                indexListToShow: index,
            });
        }
    }, [acceptInvitations, idList, setIndexListToShow]);

    const mutation = useMutation(createList, {
        onSuccess: () => {
            console.log("success mutation createList");
        },
        onError: () => {
            console.log("error mutation createList");
        },
    });

    const { isLoading } = mutation;

    const handleAddNewList: SubmitHandler<FormData> = async (data) => {
        // TODO: use react-query
        // const list = await createList();
        const { listName } = data;
        const list = await mutation.mutateAsync({ listName, userId });
        await inviteUser
            .mutateAsync({
                id: list.id,
                email: pb.authStore?.model?.email,
                status: "accept",
            })
            .then(() => {
                setIdList(list.id);
                reset();
                clickModal("myNewListModal");
            });
    };

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading]);

    return (
        <>
            {/* Put this part before </body> tag */}
            <input
                type="checkbox"
                id="myNewListModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="myNewListModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Ma nouvelle liste</h3>
                    {!isOnline && (
                        <div className="alert alert-error">
                            Vous êtes hors ligne, vous ne pouvez pas ajouter une
                            nouvelle liste.
                        </div>
                    )}
                    {acceptInvitations.length >= 5 && (
                        <div className="alert alert-warning">
                            Désolé vous ne pouvez pas être sur plus de 5 listes
                            à la fois. Pour en créer une nouvelle, vous devez
                            d'abord quitter une liste.
                        </div>
                    )}
                    <div className="py-4">
                        <form className="flex flex-col">
                            <label className="label">
                                <span className="label-text">
                                    Nom de la liste
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Liste"
                                className="input input-bordered w-100%"
                                {...register("listName")}
                            />
                            <FormErrorMsg
                                messageError={errors.listName?.message}
                            />
                        </form>
                        <label
                            htmlFor="myNewListModal"
                            className={`btn btn-primary mt-4 w-full ${
                                (!isOnline || isLoading || acceptInvitations.length >= 5) && "btn-disabled"
                            } `}
                            onClick={handleSubmit(handleAddNewList)}
                        >
                            {isLoading && (
                                <span className="loading loading-ring loading-xs ml-1"></span>
                            )}
                            Ajouter
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalMyNewList;
