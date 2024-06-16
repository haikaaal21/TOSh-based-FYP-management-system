export default interface ProjectCardProps {
  projectid: number;
  projectimg: string;
  projecttitle: string;
  supervisorname: string;
  typeofproject: string;
  projectdescription: string;
  projectNotification?: number;
  projectBatch?: string;
  pendingForDeletion?: boolean;
}
