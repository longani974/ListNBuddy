import { atom } from "recoil";
import { Record } from "pocketbase";
import { Lists } from "../types/dbPocketbasetypes";

export interface Users extends Record {
    username: string;
    verified: boolean;
    emailVisibility: boolean;
    email: string;
    name: string;
    avatar: string;
}

export interface Invitations extends Record {
    user: string;
    list: string;
    by: string;
    expand: { list: Lists, user: Users, by: Users };
}

export interface InvitationsExpand {
    list: Lists;
}

export interface InvitationState {
    invitations: Invitations[];
}

const defaultInvitationState: InvitationState = {
    invitations: [],
};

export const invitationState = atom<InvitationState>({
    key: "invitationState",
    default: defaultInvitationState,
});
