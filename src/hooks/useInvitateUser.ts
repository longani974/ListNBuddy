import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";

interface NewInvitation {
    id: string;
    email: string;
    status: "waiting" | "accept";
}

export const useInvitateUser = () => {
    // const { userId } = useRecoilValue(userState);

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
            by: pb.authStore?.model?.id,
            status: status,
        };

        const invitateCreateResponse = await pb
            .collection("invitations")
            .create(data);

        return invitateCreateResponse;
    };

    const mutateCreateInvitation = useMutation(createInvitation);

    const getUserId = async (newInvitation: NewInvitation) => {
        const userId = await pb.collection("users").getList(1, 20, {
            filter: `email = "${newInvitation.email}"`,
            fields: "id",
        });

        // Check if user exist
        if (userId.items.length === 0) {
            throw new Error("Pas d'utilisateur avec cette email");
        }

        // Check if user is already invited
        // get invitation by user and list
        const invitations = await pb.collection("invitations").getList(1, 20, {
            filter: `user = "${userId.items[0].id}" && list = "${newInvitation.id}"`,
            fields: "id, user, list,by",
        });

        // Check if user is the user who invite
        if (invitations.items.length > 0 && invitations.items[0].by === userId.items[0].id) {
            throw new Error("Vous ne pouvez pas vous inviter vous même");
        }

        // Check if user is already invited
        if (invitations.items.length > 0) {
            throw new Error("Utilisateur déjà invité");
        }
        

        const isAlreadyInvited = invitations.items.length > 0;

        return { userId, isAlreadyInvited };
    };

    const mutateList = useMutation(getUserId, {
        onSuccess: (data, newInvitation) => {
            const { userId: user } = data;
            
            mutateCreateInvitation.mutateAsync({
                listId: newInvitation.id,
                invitateId: user.items[0].id,
                status: newInvitation.status || "waiting",
            });
        },
    });
    return mutateList;
};
