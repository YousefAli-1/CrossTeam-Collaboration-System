import { Injectable } from "@angular/core";
import { dummyTeamMembers, dummyProjects, dummyTasks } from "./dummy-members";
import { type TeamMember, type Project,type Task } from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    private readonly teamMembers = dummyTeamMembers;
    private readonly projects = dummyProjects;
    private readonly tasks = dummyTasks;

    getProjectById(id: number){
        return{name: 'Project1', description: 'This is a project Demo'};
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

    getCurrentUser(): any {
        const currentUser = this.teamMembers[1];
        return {
            subscribe: (callback: (user: TeamMember | null) => void) => {
                callback(currentUser || null);
            }
        };
    }

    getTasksForUser(userID: number): any {
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

        return {
            subscribe: (callback: (tasks: Task[]) => void) => {
                callback(userTasks);
            }
        };
    }
 
}