export interface Lists {
    articles: string[];
    collectionId: string;
    collectionName: string;
    createBy: string;
    created: Date;
    expand: ListsExpand;
    id: string;
    name: string;
    participants: string[];
    updated: Date;
    modifiedArticle: string;
}

export interface ListsExpand {
    articles: Article[];
}

export interface Article {
    addBy: string;
    collectionId: string;
    collectionName: string;
    created: Date;
    id: string;
    isBuyed: boolean;
    isBuyedBy: string;
    name: string;
    quantity: string;
    updated: Date;
    expand: Article[];
}
