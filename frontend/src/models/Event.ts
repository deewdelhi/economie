export interface Event {
    id?: number;
    name: string;
    description:string;
    starting_date:Date;
    ending_date:Date;
    creator:string;
    capacity:number;
    location:string;
    preferences:[];
    skills:[];

}