export default interface Task {
  tasktitle: string;
  taskdescription: string;
  duedate: string;
  yellowzone: string;
  redzone: string;
  lock: boolean;
  batch: number;
  taskfiles: File[];
  assignedfrom: number;
}
