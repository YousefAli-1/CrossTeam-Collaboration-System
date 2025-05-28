import { type ProjectManager,type Project,type Task,type Team} from "../app.model"
// Dummy data for Team Members
export const dummyProjectManager: ProjectManager[] = [
    {
        userID: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        Projects: []
    },
    {
        userID: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        Projects: [] 
    },
];

// Dummy data for Teams




// Dummy data for Projects
export const dummyProjects: Project[] = [
    {
        projectID: 101,
        projectName: 'Project Alpha',
        projectDescription: 'A top-secret project.',
        createdBy: {
            userID: 5,
            name: 'Eve Adams',
            email: 'eve.adams@example.com',
            Projects: [],
        },
        tasks: [], 
        members: [{ ...dummyTeamMembers[0], isInviteAccepted: true },{ ...dummyTeamMembers[1], isInviteAccepted: true }],
        teams: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Dummy data for Tasks
export const dummyTasks: Task[] = [
    {
        project: dummyProjects[0],
        taskID: 201,
        taskName: 'Task 1',
        taskDescription: 'Complete the initial setup.',
        deadline: new Date(),
        assigned: {
            teamID: 301,
            teamName: 'Team Alpha',
            teamDescription: 'Alpha team description.',
            teamMembers: dummyTeamMembers,
        }, 
        isSubmitted: true,
        submittedBy: dummyTeamMembers[0],
        approvalWorkflow: [{
                approvalRequestID: Math.random(), 
                comments: [], 
                status: 'Pending',
                assigned: dummyTeams[0],
                reviewedBy: null,
                createdAt: new Date(),
                updatedAt: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

// Link tasks to projects after both are declared
dummyProjects[0].tasks = [dummyTasks[0]];
dummyTeamMembers[0].Projects = dummyProjects;
