import { createContext, useState } from 'react';

interface Speaker {
  name: string;
  bio: string;
  image: File;
  contact: string;
}

interface event {
  image: File;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  speakers: Speaker[];
  files: File[];
  attendees: number[];
  eventhead: number;
  batch: number;
}

const getEventContextFromSession = () => {
  const sessionContext = sessionStorage.getItem('event');
  if (sessionContext) {
    return JSON.parse(sessionContext);
  } else {
    return {
      image: {} as File,
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      speakers: [],
      files: [],
      attendees: [],
      eventhead: 0,
      batch: 0,
    } as event;
  }
};

const EventContext = createContext({} as any);
export const EventContextProvider = ({ children }: any) => {
  const [eventItem, setEventItem] = useState(getEventContextFromSession());
  const [newSpeaker, setNewSpeaker] = useState({
    name: '',
    bio: '',
    image: {} as File,
    contact: '',
  });

  const clearSpeakerInstance = () => {
    setNewSpeaker({
      name: '',
      bio: '',
      image: {} as File,
      contact: '',
    });
  };

  const appendSpeaker = () => {
    setEventItem({
      ...eventItem,
      speakers: [...eventItem.speakers, newSpeaker],
    });
    clearSpeakerInstance();
  };

  const onChangeEvent = (name: string, value: any) => {
    setEventItem({ ...eventItem, [name]: value });
  };

  const appendFiles = (newFiles: File[]) => {
    setEventItem({ ...eventItem, files: [...eventItem.files, ...newFiles] });
  };

  const changeImage = (newImage: File) => {
    setEventItem({ ...eventItem, image: newImage });
  };

  const deleteImage = () => {
    setEventItem({ ...eventItem, image: {} as File });
  };

  const refreshEvent = () => {
    setEventItem({} as event);
  };

  const alterAttendees = (attendees: number[]) => {
    setEventItem({ ...eventItem, attendees });
  };

  const deleteItem = (file: File) => {
    setEventItem({
      ...eventItem,
      files: eventItem.files.filter((item: File) => item !== file),
    });
  };

  // Speaker Items

  const deleteSpeakerImage = () => {
    setNewSpeaker({
      ...newSpeaker,
      image: {} as File,
    });
  };

  const deleteSpeaker = (index: number) => {
    setEventItem({
      ...eventItem,
      speakers: eventItem.speakers.filter(
        (_speaker: Speaker, i: number) => i !== index
      ),
    });
  };

  const onChangeSpeaker = (name: string, value: any) => {
    setNewSpeaker({ ...newSpeaker, [name]: value });
  };

  const uploadSpeakerImage = (file: File) => {
    setNewSpeaker({ ...newSpeaker, image: file });
  };

  const getFormedDataFormat = () => {
    const formedData = new FormData();
    formedData.append('eventtitle', eventItem.title);
    formedData.append('eventdescription', eventItem.description);
    formedData.append('eventdate', eventItem.date);
    formedData.append('eventtime', eventItem.time);
    formedData.append('gmapembed', eventItem.location);
    if (eventItem.image instanceof File) {
      formedData.append('eventImage', eventItem.image);
    }
    for (let i = 0; i < eventItem.attendees.length; i++) {
      formedData.append('attendees', eventItem.attendees[i]);
    }
    formedData.append('batch', eventItem.batch);
    for (let i = 0; i < eventItem.speakers.length; i++) {
      if (eventItem.speakers[i].image instanceof File) {
        formedData.append(`speakerimage`, eventItem.speakers[i].image);
      } else {
        formedData.append(`speakerimage`, {} as File);
      }
      formedData.append(
        `speakers`,
        JSON.stringify({
          name: eventItem.speakers[i].name,
          bio: eventItem.speakers[i].bio,
          contact: eventItem.speakers[i].contact,
        })
      );
    }
    for (let i = 0; i < eventItem.files.length; i++) {
      if (eventItem.files[i] instanceof File) {
        formedData.append(`eventFiles`, eventItem.files[i]);
      }
    }
    return formedData;
  };

  return (
    <EventContext.Provider
      value={{
        deleteSpeaker,
        getFormedDataFormat,
        alterAttendees,
        appendSpeaker,
        onChangeEvent,
        changeImage,
        appendFiles,
        refreshEvent,
        eventItem,
        deleteImage,
        deleteItem,
        newSpeaker,
        onChangeSpeaker,
        deleteSpeakerImage,
        uploadSpeakerImage,
        clearSpeakerInstance,
      }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
