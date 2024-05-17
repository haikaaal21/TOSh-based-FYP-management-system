import { Card, Divider, Grid, TextField } from '@mui/material';
import ComplaintReply from '../ComplaintReply';
import { IoChatbox, IoDocument } from 'react-icons/io5';
import FileCard from '../FileCard';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import Loading from '../../Loading';
import dayjs from 'dayjs';
import { MdCalendarMonth, MdSend } from 'react-icons/md';
import usePost from '../../../hooks/api/usePost';
import AuthUser from '../../../context/AuthUserContext';
import Popup from '../Popup';

const ComplaintPage = () => {
  const { complaintid } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const { state, handleGet } = useGet();
  const { state: postState, handlePost } = usePost();
  const { auth } = useContext(AuthUser);
  

  const [replyInput, setReplyInput] = useState('');
  const [replyError, setReplyError] = useState('');
  
  const onChange = (e: any) => {
    setReplyInput(e.target.value);
  }

  const validator = () => {
    if(replyInput.length < 1){
      setReplyError('Reply cannot be empty');
    } else if(replyInput.length < 8) {
      setReplyError('Reply too short');
    } else if(replyInput.length > 500) {
      setReplyError('Reply too long');
    } else {
      setReplyError('');
    }
  }

  const [popupItem, setPopupItem] = useState<any>(null);
  const [replyBool, setReplyBool] = useState(false);

  const handleReplyCreation = (e: any) => {
    e.preventDefault();
    if(replyError === '') {
      setReplyBool(!replyBool);
      handlePost(`${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}complaint/${complaint.complaintid}/reply/create/${auth.user.id}`, {
        replytext: replyInput
      }); 
      setReplyBool(!replyBool);
    } else {
      setPopupItem({
        title: 'Reply Error',
        content: 'Please check the reply input field for errors.',
        button1: 'OK',
        yesClicked: () => {
          setPopupItem(null);
        }
      })
    }
  }
  
  useEffect(() => {
    if(postState.data && postState.data.status === 500) {
      setPopupItem({
        title: 'Reply Error',
        content: 'There was an error while creating the reply. Please try again later.',
        button1: 'OK',
        yesClicked: () => {
          setPopupItem(null);
        } 
      })
    } else if (postState.data && postState.data.status === 200) {
      handleGet(
        import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
          `complaint/fetchdetails/${complaintid}`
      );
    }
  }, [postState, replyBool])

  useEffect(() => {
    validator();
  }, [replyInput])

  useEffect(() => {
    console.log(replies);
  })

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `complaint/fetchdetails/${complaintid}`
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setComplaint(state.data.complaints.details);
      setFiles(state.data.complaints.files);
      setReplies(state.data.complaints.replies);
    }
  }, [state]);

  return (
   <>
   {complaint && files && replies   ? (
     <>
     {
        popupItem ? (
          <Popup {...popupItem} />
        ) : null
     }
     <div style={{ height: '25px' }} />
     <Card
       sx={{
         height: '90vh',
         overflowY: 'scroll',
       }}>
       <Grid container>
         <Grid item sx={{ padding: '15px 10px' }} xs={12} md={6}>
           <Grid container>
             <Grid item xs={12} md={6}>
               <p
                 style={{
                   display: 'flex',
                   alignItems: 'center',
                 }}
                 className="subtitle">
                 <IoDocument />
                 Ticket ID#{complaint.complaintid}
               </p>
             </Grid>
             <Grid item xs={12} md={6}>
               <p className="subtitle" style={{
                display:'flex',
                alignItems:'center'
               }}><MdCalendarMonth />&nbsp; Created on : {dayjs(complaint.complaintdate).format('DD MMMM YYYY')}</p>
             </Grid>
           </Grid>
           <h1>{complaint.complainttitle}</h1>
           <p>{complaint.complainttext}</p>
           <Divider sx={{ height: '25px' }} />
           <h2>Attached Files</h2>
           <div style={{ width: '100%', overflowX: 'scroll', display:'flex' }}>
             {
                files.map((file:any) => {
                    return (
                      <>
                      <FileCard
                        typeOfFile={file.complaintfiletype}
                        fileName={file.complaintfiletitle}
                        fileurl={file.complaintfilename}
                        />
                      </>
                    )
                })
             }
           </div>
         </Grid>
         <Grid item sx={{ padding: '15px 10px' }} xs={12} md={6}>
           <h2>
             <IoChatbox /> Replies
           </h2>
           <div
             style={{
               height: '100%',
               backgroundColor: 'silver',
               padding: '15px 10px',
               borderRadius: '10px 10px 0px 0px',
             }}>
             {
              replies.map((reply:any) => {
                
                return (
                  <ComplaintReply {...reply} />
                )
              })
             }
           </div>
           <form onSubmit={handleReplyCreation}>
           <div style={{display:'flex', margin:'10px 0'}}>
             <TextField
                value={replyInput}
                onChange={onChange}
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
              />
              <button style={{width:'15%'}}><MdSend /></button>
           </div>
           <p className='subtitle'>{replyError}</p>
           </form>
         </Grid>
       </Grid>
     </Card>
   </>
   ):(
    <div style={{
        width:'100%',
        height:'80vh',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }}>
        <Loading />
   </div>
   )}
   </>
  );
};

export default ComplaintPage;
