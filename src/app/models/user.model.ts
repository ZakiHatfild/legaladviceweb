import { Constants } from "app/app.constants";

export class User 
{
    id: number;
    name: string;
    imageUrl: string;

    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.imageUrl = user.imageUrl;
    }
}
