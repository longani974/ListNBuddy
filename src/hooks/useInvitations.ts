import { useState, useEffect } from "react";
import {
    Invitations,
    invitationState,
    InvitationStatus,
} from "../atoms/invitationAtoms";
import { useRecoilValue } from "recoil";

export default function useInvitations(filterStatus: InvitationStatus) {
    const [filteredInvitations, setFilteredInvitations] = useState<
        Invitations[]
    >([]);
    const { invitations } = useRecoilValue(invitationState);

    useEffect(() => {
        if (filterStatus === "accept") {
            console.log("useInvitations");
            console.log(invitations);
        }
        setFilteredInvitations([
            ...invitations.filter(
                (invitation) => invitation.status === filterStatus
            ),
        ]);
    }, [filterStatus, invitations]);

    return filteredInvitations;
}
