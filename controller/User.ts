import { Project } from "./Project";

export abstract class User{
    private userID!: number;
    private name!: String;
    private email!: String;
    private projects!: Project[];

    User(userID: number, name: String, email: String, projects: Project[]){
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.projects = projects;
    }
    static getUserByID(userID: number): User | undefined{
        return undefined;
    }
};