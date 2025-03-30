export type User= {readonly userID: number, name: String, email: String, Projects: Project[]};

export type ProjectManager = User;

export type TeamMember= User & {canSubmitTask: boolean, canReviewTask: boolean, canAcceptOrRejectTask: boolean};

type ProjectMember= TeamMember & {isInviteAccepted: boolean};

export type Project= {readonly projectID: number, projectName: String, projectDescription: String, createdBy: ProjectManager, tasks: Task[], members: ProjectMember[], teams: Team[], createdAt: Date, updatedAt: Date};

export type Task={readonly taskID: number, taskName: String, taskDescription: String, deadline: Date,assigned: Team, isSubmitted: boolean, submittedBy: TeamMember, approvalWorkflow: ApprovalRequest[], createdAt: Date, updatedAt: Date};

export type Team={readonly teamID: number, teamName: String, teamDescription: String, teamMembers: TeamMember[]};

export type ApprovalRequestStatus= 'Accepted' | 'Rejected' | 'Pending';

export type ApprovalRequest={readonly approvalRequestID: number, comments: Comment[], status: ApprovalRequestStatus, reviewedBy: TeamMember, createdAt: Date, updatedAt: Date};

export type Comment={readonly commentID: number, commentText: String, createdAt: Date};