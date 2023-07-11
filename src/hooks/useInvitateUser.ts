import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue } from "recoil";

interface List {
    id: string;
    invited: string[];
    participants: string[];
    email: string;
}

export const useInvitateUser = (list: List) => {
    const { userId } = useRecoilValue(userState);

    const createInvitation = async ( listId:string, invitateId:string ) => {
        const data = {
            "user": invitateId,
            "list": listId,
            "by": userId,
            "status": "waiting",
        };
        {
            try {
                await pb.collection('invitations').create(data)
            } catch (e) {
                console.log(e);
            }
        }
    };

    const updateList = async () => {
        const record = await pb.collection("users").getList(1, 20, {
            filter: `email = "${list.email}"`,
        });

        if (record.items.length === 0) {
            return console.log("Pas d'utilisateur avec cette email");
        }

        // if (list.invited.includes(record.items[0].id)) {
        //     return console.log("Utilisateur déjà invité");
        // }

        if (record.items[0].id === userId) {
            return console.log("Vous ne pouvez pas vous inviter vous même");
        }

        // TODO: change the way to check if user is already in the list
        // because particpants in list doesn't exist anymore
        // if (list.participants.includes(record.items[0].id)) {
        //     return console.log("Utilisateur déjà dans la liste");
        // }


        await createInvitation(list.id, record.items[0].id );
    }

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
