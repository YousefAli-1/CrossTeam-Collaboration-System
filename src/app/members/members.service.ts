import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MembersService{
    getProjectById(id: number){
        return{name: 'Project1', description: 'This is a project Demo'};
    }
};