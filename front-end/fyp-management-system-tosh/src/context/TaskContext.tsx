import { createContext, useEffect, useState } from 'react';
import Task from '../types/Task';

const TaskContext = createContext({} as any);

const getLocalContext = () => {
  const sessionContext = sessionStorage.getItem('task');
  if (sessionContext) {
    return JSON.parse(sessionContext);
  } else {
    return {
      tasktitle: '',
      taskdescription: '',
      duedate: '',
      yellowzone: '',
      redzone: '',
      lock: false,
      batch: 0,
      taskfiles: [],
      taskRecipients: [],
      assignedfrom: 0,
    } as Task;
  }
};

export const TaskContextProvider = ({ children }: any) => {
  const [task, setTask] = useState(getLocalContext());

  const onChangetask = (name: string, value: any) => {
    setTask({ ...task, [name]: value });
  };

  const lockLogic = () => {
    setTask({ ...task, lock: !task.lock });
  };

  const clearTask = () => {
    setTask({} as Task);
  };

  const appendFiles = (files: any) => {
    setTask({ ...task, taskfiles: [...task.taskfiles, ...files] });
  };

  const deleteFile = (file: any) => {
    const newFiles = task.taskfiles.filter((f: any) => f !== file);
    setTask({ ...task, taskfiles: newFiles });
  };

  const alterRecipients = (recipients: number[]) => {
    setTask({ ...task, taskRecipients: recipients });
  };

  const getFormedDataFormat = () => {
    const formedData = new FormData();
    const due = task.duedate.toISOString();
    const yellow = task.yellowzone.toISOString();
    const red = task.redzone.toISOString();
    formedData.append('tasktitle', task.tasktitle);
    formedData.append('taskdescription', task.taskdescription);
    formedData.append('duedate', due);
    formedData.append('yellowzone', yellow);
    formedData.append('redzone', red);
    formedData.append('lock', task.lock);
    formedData.append('assignedfrom', task.assignedfrom);
    formedData.append('batchid', task.batch);
    for (let i = 0; i < task.taskfiles.length; i++) {
      formedData.append('taskFiles', task.taskfiles[i] as Blob);
    }
    for (let i = 0; i < task.taskRecipients.length; i++) {
      formedData.append('assignedto', task.taskRecipients[i]);
    }
    return formedData;
  };

  return (
    <TaskContext.Provider
      value={{
        alterRecipients,
        onChangetask,
        lockLogic,
        clearTask,
        appendFiles,
        task,
        deleteFile,
        getFormedDataFormat,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
