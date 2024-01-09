import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { InvitationStatus, invitationState } from "../atoms/invitationAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useClickModal } from "./useClickModal";
import useInvitations from "./useInvitations";
import { listToShow } from "../atoms/listToShow";

interface Invitation {
    listId: string;
    status: InvitationStatus;
}

export const useHandleStatusInvitation = () => {
    const { invitations } = useRecoilValue(invitationState);
    const [idList, setIdList] = useState<string>("");

    const { clickModal } = useClickModal();
    const acceptInvitations = useInvitations("accept");
    const setIndexListToShow = useSetRecoilState(listToShow);

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

    const updateStatus = async ({ listId, status }: Invitation) => {
        const invitation = invitations.filter(
            (invitation) => invitation.list === listId
        )[0];
        const request = await pb.collection("invitations").update(invitation.id, {
            status: status,
        });
        return request
    };

    const mutateSatus = useMutation(updateStatus, {
        onSuccess: (res) => {
            console.log("Status updated");
            console.log(res)
            setIdList(res?.list) // WARNING: when refactoring this part in other we use res?.id and here the id is the invitation id so we use res?.list (the list id)
            clickModal("myInvitationModal");

            // signalListChanged();
        },
        onError: () => {
            console.log("error updating status");
        },
        onSettled: () => {
            console.log("onSettled updating status");
        },
    });

    return mutateSatus;
};
