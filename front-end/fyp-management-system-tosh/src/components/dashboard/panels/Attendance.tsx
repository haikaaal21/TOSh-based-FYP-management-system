import { MdPeople, MdUpdate } from "react-icons/md";
import { useParams } from "react-router"
import useGet from "../../../hooks/api/useGet";
import { useEffect, useState } from "react";
import Repostitory from "../../repository";
import { Alert, Grid, Snackbar } from "@mui/material";
import usePost from "../../../hooks/api/usePost";

const Attendance = () => {
    const {eventid} = useParams();
    const {state, handleGet} = useGet();
    const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
    const [profiles, setProfiles] = useState([] as any);
    const [attended, setAttended] = useState([] as any);
    const [modifications, setModifications] = useState([] as any);

    useEffect(() => {
        handleGet(
            url +'event/attendance/' + eventid +'/get'
        )
    }, [])

    useEffect(() => {
        if (state.data) {
            const updatedProfiles = state.data.map((profile: any) => {
                if (!profile.attended) {
                    return {
                        name: profile.name,
                        id: profile.userid,
                        image: profile.profilepic
                    };
                }
                return null;
            }).filter(Boolean);
            setProfiles(updatedProfiles);
            const attendedItems = state.data.map((profile:any) => {
                if(profile.attended) {
                    return {
                        name:profile.name,
                        id: profile.userid,
                        image: profile.profilepic
                    };
                }
                return null;
            }).filter(Boolean);
            setAttended(attendedItems)
        }
    }, [state.data]);

    const addToAttendance = (id:number) => {
        const item = {
            uid: id,
            attended: true
        }
        const existingItemIndex = modifications.findIndex((item:any) => item.uid === id);
        if (existingItemIndex !== -1) {
            const updatedItem = {
                ...modifications[existingItemIndex],
                attended: true
            };
            const updatedModifications = [...modifications];
            updatedModifications[existingItemIndex] = updatedItem;
            setModifications(updatedModifications);
        } else {
            setModifications([...modifications, item]);
        }
        const fullItem = profiles.find((profile:any) => profile.id === id);
        setProfiles(profiles.filter((profile: any) => profile.id !== id));
        setAttended([...attended, fullItem]);
    }

    const removeFromAttendance = (id:number) => {
        const item = {
            uid: id,
            attended: false
        }
        const existingItemIndex = modifications.findIndex((item:any) => item.uid === id);
        if (existingItemIndex !== -1) {
            const updatedItem = {
                ...modifications[existingItemIndex],
                attended: false
            };
            const updatedModifications = [...modifications];
            updatedModifications[existingItemIndex] = updatedItem;
            setModifications(updatedModifications);
        } else {
            setModifications([...modifications, item]);
        }
        const fullItem = attended.find((profile:any) => profile.id === id);
        setAttended(attended.filter((profile: any) => profile.id !== id));
        setProfiles([...profiles, fullItem]);
    }

    const [snackItems, setSnackItems] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    })

    const {state:postState, handlePost} = usePost();

    const updateModifications = () => {
        if(modifications.length > 0) {
            handlePost(url + 'event/attendance/' + eventid + '/update', {
                modifications
            });
        }
    }

    useEffect(() => {
        if(postState.data) {
            setSnackItems({
                open: true,
                message: 'Modifications Updated! Reloading Page in 2 seconds',
                severity: 'success'
            })
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } else if(postState.error) {
            setSnackItems({
                open: true,
                message: 'Error! Server error!',
                severity: 'error'
            })
        }
    }, [postState])



    return (
        <>
            <Snackbar
            open={snackItems.open}
            autoHideDuration={6000}
            onClose={() =>
                setSnackItems({ open: false, message: '', severity: 'success' })
              }
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert sx={{ width: '80vw' }} severity={snackItems.severity}>
          {snackItems.message}
        </Alert>
            </Snackbar>
            <p style={{marginTop:'10px'}} className="subtitle">EventID#{eventid}</p>
            <h2 style={{display:'flex', alignItems:'center'}}><MdPeople />&nbsp;Attendance</h2>
           <Grid gap={1} container>
                <Grid item xs={12} md={5.5}>
                <h4>Not Attended</h4>
                <Repostitory
                    items={profiles}
                    staff={false}
                    buttonClick={(id) => addToAttendance(id)}
                    add={true}
                    noDetails={true}
                />
                </Grid>
                <Grid item xs={12} md={5.5}>
                <h4>Not Attended</h4>
                <Repostitory
                    items={attended}
                    staff={false}
                    buttonClick={(id) => removeFromAttendance(id)}
                    add={false}
                    noDetails={true}
                />
                </Grid>
           </Grid>
           <button disabled={modifications.length <1} onClick={updateModifications} className="buttonWithLeading full-width"><MdUpdate />&nbsp;Update Attendance</button>
        </>
    )
 }

 export default Attendance;