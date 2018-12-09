export class Profile 
{
    id: number;
    name: string;
    imageUrl: string;
    email: string;
    isEmployee: boolean;

    constructor(profile) {
        this.id = profile.id;
        this.name = profile.name;
        this.imageUrl = profile.imageUrl;
        this.email = profile.email;
        this.isEmployee = profile.isEmployee;
    }
}
