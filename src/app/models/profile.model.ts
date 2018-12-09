export class Profile 
{
    id: number;
    name: string;
    imageUrl: string;
    email: string;
    isEmployee: boolean;

    constructor(profile) {

        let images = [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Oleg_Zherebtsov.jpg/266px-Oleg_Zherebtsov.jpg',
            'http://logobaker.ru/media/uploads/userapi/logos/51/400_300_1751-yurist.jpg'];

        this.id = profile.id;
        this.name = profile.name;
        if (profile.isEmployee) {
            this.imageUrl = images[0];
        } else {
            this.imageUrl = images[1];
        }
        this.email = profile.email;
        this.isEmployee = profile.isEmployee;
    }
}
