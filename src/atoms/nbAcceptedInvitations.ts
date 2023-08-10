import { atom } from "recoil";

export interface acceptedInvitationsState {
    nbOfAcceptedInvitations: number;
}

const defaultNbOfAcceptedInvitations: acceptedInvitationsState = {
    nbOfAcceptedInvitations: 0,
}

export const nbOfAcceptedInvitations = atom<acceptedInvitationsState>({
    key: "nbOfAcceptedInvitations",
    default: defaultNbOfAcceptedInvitations,
});