export class Cat {
    static idCounter: number = 0;

    id: number;
    name: string;
    fur: string;

    constructor(name: string, fur: string) {
        this.name = name;
        this.fur = fur;
        this.id = Cat.idCounter++;
    }
}
