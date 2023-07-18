import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue } from "recoil";

interface NewInvitation {
    id: string;
    email: string;
    status: "waiting" | "accept";
}

export const useInvitateUser = () => {
    const { userId } = useRecoilValue(userState);

    const createInvitation = async ({
        listId,
        invitateId,
        status,
    }: {
        listId: string;
        invitateId: string;
        status?: "waiting" | "accept";
    }) => {
        const data = {
            user: invitateId,
            list: listId,
            by: userId,
            status: status,
        };
        {
            try {
                await pb.collection("invitations").create(data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const mutateCreateInvitation = useMutation(createInvitation, {
        onSuccess: () => {
            console.log("invitation created");
        },
        onError: () => {
            console.log("error invitation created");
        },
        onSettled: () => {
            console.log("onSettled invitation created");
        },
    });

    const updateList = async (newInvitation: NewInvitation) => {
        const record = await pb.collection("users").getList(1, 20, {
            filter: `email = "${newInvitation.email}"`,
            fields: "id",
        });

        if (record.items.length === 0) {
            return console.log("Pas d'utilisateur avec cette email");
        }

        // if (list.invited.includes(record.items[0].id)) {
        //     return console.log("Utilisateur déjà invité");
        // }

        // TODO: change the way to check if user is already in the list because on create list we need to autoinvite the user
        // if (record.items[0].id === userId) {
        //     return console.log("Vous ne pouvez pas vous inviter vous même");
        // }

        // TODO: change the way to check if user is already in the list
        // because particpants in list doesn't exist anymore
        // if (list.participants.includes(record.items[0].id)) {
        //     return console.log("Utilisateur déjà dans la liste");
        // }

        await mutateCreateInvitation.mutateAsync({
            listId: newInvitation.id,
            invitateId: record.items[0].id,
            status: newInvitation.status || "waiting",
        });

        // await createInvitation(newInvitation.id, record.items[0].id, newInvitation.status || "waiting");
    };

    const mutateList = useMutation(updateList, {
        onSuccess: () => {
            console.log("updateList");
        },

        onError: (e) => {
            console.log("error");
            console.log(e);
        },
        onSettled: () => {
            console.log("onSettled");
        },
    });

    return mutateList;
};
