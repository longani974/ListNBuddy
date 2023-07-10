// import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { Invitations } from "../atoms/invitationAtoms";
// import { useEffect } from "react";

// type RealTimeList = {
//     data: void | undefined;
//     isLoading: boolean;
//     error: unknown; // A remplacer par le type correct
// };

export const useRealTimeList = (
    listId: string,
    indexListToShow: number,
    invitations: Invitations[] // A remplacer par le type correct
) => {
    const fetchRealTimeList = async () => {
        await pb.collection("lists").subscribe(listId, async function () {
            const acceptedInvitations = await pb
                .collection("invitations")
                .getList(1, 5, {
                    filter: `user.id = "${pb.authStore.model?.id}" && status = "accept"`,
                    expand: "user,list,by",
                    sort: "created",
                });

            const index = invitations.findIndex(
                (invitation) => invitation.list === listId || 0
            );
            const newInvitations = [...invitations];
            newInvitations[index] = acceptedInvitations.items[
                indexListToShow
            ] as Invitations;
            return { invitations: newInvitations };
        });

        return () => {
            pb.collection("lists").unsubscribe(listId);
        };
    };

    const { data, isLoading, error } = useQuery(
        ["realTimeList"],
        fetchRealTimeList,
        { enabled: listId.length > 0 }
    );

    return { data, isLoading, error };
};
