import { Record } from "pocketbase";
import { Users } from "../atoms/invitationAtoms";

export interface Lists extends Record {
    articles: string[];
    invited: string[];
    name: string;
    // participants: string[];
    expand: { articles: Article[] };
}

export interface Article extends Record {
    addBy: string;
    isBuyed: boolean;
    isBuyedBy: string;
    name: string;
    quantity: string;
    expand: { isBuyedBy: Users; addBy: Users };
}
