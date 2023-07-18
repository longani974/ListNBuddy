import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { InvitationStatus, invitationState } from "../atoms/invitationAtoms";
import { useRecoilValue } from "recoil";

interface Invitation {
    listId: string;
    status: InvitationStatus;
}

export const useHandleStatusInvitation = () => {
    const { invitations } = useRecoilValue(invitationState);

    const updateStatus = async ({ listId, status }: Invitation) => {
        const invitation = invitations.filter(
            (invitation) => invitation.list === listId
        )[0];
        await pb.collection("invitations").update(invitation.id, {
            status: status,
        });
    };

    const mutateSatus = useMutation(updateStatus, {
        onSuccess: () => {
            console.log("Status updated");
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
