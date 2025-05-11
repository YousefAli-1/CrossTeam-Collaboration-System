import {type Project,type Task,type Team, Invitation,User,ProjectManager, UserEssentials, UserInProject} from "../app.model"
// Dummy data for Team Members
const dummyUsers: User[] =[
    {
        userID: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        Projects: [],
    },
    {
        userID: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        Projects: [],
    },
    {
        userID: 3,
        name: 'Hossam Hassan',
        email: 'hossam.hassan@example.com',
        Projects: [],
    },
    {
        userID: 4,
        name: 'Ibrahim Hassan',
        email: 'ibrahim.hassan@example.com',
        Projects: [],
    }
];

export const dummyTeamMembers: UserInProject[] = [
    {
        ...dummyUsers[0],
        canSubmitTask: true,
        canAcceptOrRejectTask: false,
    },
    {
        ...dummyUsers[1],
        canSubmitTask: false,
        canAcceptOrRejectTask: true,
    },
    {
        ...dummyUsers[2],
        canSubmitTask: true,
        canAcceptOrRejectTask: true,
    },
    {
        ...dummyUsers[3],
        canSubmitTask: false,
        canAcceptOrRejectTask: true,
    },
];

// Dummy data for project manager

export const dummyProjectManager: ProjectManager[] =[
    {
        userID: 1,
        name: 'Salooha',
        email: 'salah@example.com',
        Projects: []
    },
    {
        userID: 2,
        name: 'Mervat',
        email: 'moddy@example.com',
        Projects: []
    },
];

// Dummy data for Teams
export const dummyTeams:Team[] = [
    {
        teamID: 301,
        teamName: 'Design',
        teamDescription: 'This team is responsible for design',
        teamMembers: [dummyTeamMembers[0],dummyTeamMembers[1]],
    },
    {
        teamID: 302,
        teamName: 'Development',
        teamDescription: 'This team is responsible for implementation',
        teamMembers: [dummyTeamMembers[2]],
    },
    {
        teamID: 303,
        teamName: 'Testers',
        teamDescription: 'This team is responsible for testing',
        teamMembers: [dummyTeamMembers[3]],
    }
];




// Dummy data for Projects
export const dummyProjects: Project[] = [
    {
        projectID: 1,
        projectName: 'Project Alpha',
        projectDescription: 'A top-secret project.',
        createdBy: dummyProjectManager[0],
        tasks: [], 
        members: [{ ...dummyTeamMembers[0] },{ ...dummyTeamMembers[2] }],
        teams: [dummyTeams[0],dummyTeams[1],dummyTeams[3]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        projectID: 2,
        projectName: 'Project Beta',
        projectDescription: 'A secondary project for testing.',
        createdBy: {
            userID: 6,
            name: 'Charlie Brown',
            email: 'charlie.brown@example.com'
        },
        tasks: [],
        members: [{ ...dummyTeamMembers[0] },{ ...dummyTeamMembers[1] },{ ...dummyTeamMembers[2] },{ ...dummyTeamMembers[3] }],
        teams: [dummyTeams[0],dummyTeams[1],dummyTeams[3]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Dummy data for Tasks
export const dummyTasks: Task[] = [
    {
        projectID: dummyProjects[0].projectID,
        projectName: dummyProjects[0].projectName,
        taskID: 201,
        taskName: 'Task 1',
        taskDescription: 'Complete the initial setup.',
        deadline: new Date(),
        assigned: dummyTeams[0], 
        isSubmitted: true,
        submittedBy: dummyTeamMembers[0],
        approvalWorkflow: [{
                approvalRequestID: Math.random(), 
                comments: [], 
                status: 'Pending',
                assigned: dummyTeams[1],
                reviewedBy: null,
                createdAt: new Date(),
                updatedAt: new Date(),
        },{
            approvalRequestID: Math.random(), 
                comments: [], 
                status: 'Pending',
                assigned: dummyTeams[2],
                reviewedBy: null,
                createdAt: new Date(),
                updatedAt: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        projectID: dummyProjects[1].projectID,
        projectName: dummyProjects[1].projectName,
        taskID: 202,
        taskName: 'Task 2',
        taskDescription: 'Develop the core module.',
        deadline: new Date(),
        assigned: dummyTeams[1], 
        isSubmitted: false,
        submittedBy: null,
        approvalWorkflow: [{
                approvalRequestID: Math.random(), 
                comments: [], 
                status: 'Pending',
                assigned: dummyTeams[2],
                reviewedBy: null,
                createdAt: new Date(),
                updatedAt: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date()
    },
];
// Dummy data for Invitations
export const dummyInvitations: Invitation[] = [
    {
        projectId: 101,
        memberId: dummyTeamMembers[1].userID,
        invitedBy: dummyProjects[0].createdBy,
        status: 'Pending',
    },
    {
        projectId: 101,
        memberId: dummyTeamMembers[3].userID,
        invitedBy: dummyProjects[0].createdBy,
        status: 'Pending',
    },
];

// Link tasks to projects after both are declared
dummyProjects[0].tasks = [dummyTasks[0]];
dummyProjects[1].tasks = [dummyTasks[1]];