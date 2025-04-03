import { type TeamMember,type Project,type Task,type Team} from "../app.model"
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
        projectName: 'Project Alpha',
        projectDescription: 'A top-secret project.',
        createdBy: {
            userID: 5,
            name: 'Eve Adams',
            email: 'eve.adams@example.com',
            Projects: [],
        },
        tasks: [], 
        members: dummyTeamMembers.map((member) => ({
            ...member,
            isInviteAccepted: true,
        })),
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
        isSubmitted: false,
        submittedBy: dummyTeamMembers[0],
        approvalWorkflow: dummyTeamMembers
            .filter(
                (member) => member.canReviewTask && member.userID !== dummyTeamMembers[0].userID
            )
            .map((member) => ({
                approvalRequestID: Math.random(), 
                comments: [], 
                status: 'Pending',
                reviewedBy: member,
                createdAt: new Date(),
                updatedAt: new Date(),
            })), 
            createdAt: new Date(),
            updatedAt: new Date(),
    },
];

// Link tasks to projects after both are declared
dummyProjects[0].tasks = [dummyTasks[0]];

