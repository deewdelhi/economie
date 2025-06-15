export interface Event {
    id?: number;
    name: string;
    description:string;
    rating:number;
    starting_date:Date;
    ending_date:Date;
    creator:string;
    capacity:number;
    location:string;
    preferences:[];
    skills:[];

}