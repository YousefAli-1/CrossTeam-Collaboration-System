import { type TeamMember,type Project,type Task,type Team, type Invitation} from "../app.model"
// Dummy data for Team Members
export const dummyTeamMembers: TeamMember[] = [
    {
        userID: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        Projects: [],
        canSubmitTask: true,
        canReviewTask: false,
        canAcceptOrRejectTask: false,
    },
    {
        userID: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        Projects: [],
        canSubmitTask: false,
        canReviewTask: true,
        canAcceptOrRejectTask: true,
    },
];

// Dummy data for Teams
export const dummyTeams:Team[] = [
    {
        teamID: 301,
        teamName: 'Team Alpha',
        teamDescription: 'Alpha team description.',
        teamMembers: dummyTeamMembers,
    },
];




// Dummy data for Projects
export const dummyProjects: Project[] = [
    {
        projectID: 101,
        invitations: [],
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
    {
        projectID: 102,
        invitations: [],
        projectName: 'Project Beta',
        projectDescription: 'A secondary project for testing.',
        createdBy: {
            userID: 6,
            name: 'Charlie Brown',
            email: 'charlie.brown@example.com',
            Projects: [],
        },
        tasks: [],
        members: [{ ...dummyTeamMembers[0], isInviteAccepted: true }, { ...dummyTeamMembers[1], isInviteAccepted: false }],
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
    {
        project:dummyProjects[1],
        taskID: 202,
        taskName: 'Task 2',
        taskDescription: 'Develop the core module.',
        deadline: new Date(),
        assigned: {
            teamID: 301,
            teamName: 'Team Alpha',
            teamDescription: 'Alpha team description.',
            teamMembers: dummyTeamMembers,
        }, 
        isSubmitted: false,
        submittedBy: null,
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
// Dummy data for Invitations
export const dummyInvitations: Invitation[] = [
    {
        invitationID: 401,
        projectId: 101,
        memberId: dummyTeamMembers[0].userID,
        project: dummyProjects[0],
        member: dummyTeamMembers[0],
        invitedBy: dummyProjects[0].createdBy,
        status: 'Pending',
    },
    {
        invitationID: 402,
        projectId: 102,
        memberId: dummyTeamMembers[1].userID,
        project: dummyProjects[1],
        member: dummyTeamMembers[1],
        invitedBy: dummyProjects[1].createdBy,
        status: 'Pending',
    },
];

// Link invitations to projects
dummyProjects[0].invitations = [dummyInvitations[0]];
dummyProjects[1].invitations = [dummyInvitations[1]];
// Link tasks to projects after both are declared
dummyProjects[0].tasks = [dummyTasks[0]];
