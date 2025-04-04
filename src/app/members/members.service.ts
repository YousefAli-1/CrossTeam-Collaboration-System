import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { dummyTeamMembers, dummyProjects, dummyTasks } from "./dummy-members";
import { type TeamMember, type Project,type Task } from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    private readonly teamMembers = dummyTeamMembers;
     readonly projects = dummyProjects;
    private readonly tasks = dummyTasks;

    getProjectById(id: number){
        return{name: 'Project1', description: 'This is a project Demo'};
    }
    getProjectsByUserId(userId: number): Project[] {
        return this.projects.filter(project =>
            project.members.some(member => member.userID === userId && member.isInviteAccepted)
        );
    }
    getMembers(): TeamMember[] {
        return this.teamMembers;
    }

    addMember(member: TeamMember): void {
        this.teamMembers.push(member);
    }

    updateMember(updatedMember: TeamMember): void {
        const index = this.teamMembers.findIndex(member => member.userID === updatedMember.userID);
        if (index !== -1) {
            this.teamMembers[index] = updatedMember;
        }
    }

    deleteMember(userID: number): void {
        const index = this.teamMembers.findIndex(member => member.userID === userID);
        if (index !== -1) {
            this.teamMembers.splice(index, 1);
        }
    }

    getCurrentUser(): Observable<TeamMember | null> {
        const currentUser = this.teamMembers[1]; 
        return of(currentUser); 
    }


    getTasksForUser(userID: number): Task[] {
        const currentUser = this.teamMembers.find(member => member.userID === userID);
        const userTasks = this.tasks.filter(task => task.assigned.teamMembers.some(member => member.userID === userID));

        if (currentUser?.canReviewTask) {
            const reviewableTasks = this.tasks.filter(task => 
                task.isSubmitted &&
                task.approvalWorkflow.some(request => request.reviewedBy.userID === userID && request.reviewedBy.name) &&
                task.approvalWorkflow.some(request => request.reviewedBy.userID === userID) &&
                task.assigned.teamMembers.some(member => member.userID === userID)
            );
            userTasks.push(...reviewableTasks);
        }

        return userTasks;
    }
 
}