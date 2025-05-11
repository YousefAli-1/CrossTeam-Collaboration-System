export type UserEssentials = {
  readonly userID: number;
  name: String;
  email: String;
};

export type User = UserEssentials & { Projects: Project[] };

export type UserPermissions = {
  canSubmitTask: boolean;
  canAcceptOrRejectTask: boolean;
};

export type UserInProject = UserEssentials & UserPermissions;

export type ProjectManager = User;

export type Project = {
  readonly projectID: number;
  projectName: String;
  projectDescription: String;
  createdBy: UserEssentials;
  tasks: Task[];
  members: UserEssentials[];
  teams: Team[];
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  projectID: number;
  projectName: String;
  readonly taskID: number;
  taskName: String;
  taskDescription: String;
  deadline: Date;
  assigned: Team;
  isSubmitted: boolean;
  submittedBy: UserEssentials | null;
  approvalWorkflow: ApprovalRequest[];
  createdAt: Date;
  updatedAt: Date;
};

export type Team = {
  readonly teamID: number;
  teamName: String;
  teamDescription: String;
  teamMembers: UserEssentials[];
};

export type ApprovalRequestStatus = 'Accepted' | 'Rejected' | 'Pending';

export type ApprovalRequest = {
  readonly approvalRequestID: number;
  comments: Comment[];
  status: ApprovalRequestStatus;
  assigned: Team;
  reviewedBy: UserEssentials | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  readonly commentID: number;
  commentText: String;
  createdAt: Date;
};

export type InvitationStatus = 'Pending' | 'Accepted' | 'Rejected';

export type Invitation = {
  readonly projectId: number;
  readonly memberId: number;
  invitedBy: UserEssentials;
  status: InvitationStatus;
};
