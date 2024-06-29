import { Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import usePost from '../hooks/api/usePost';

const KalPage = () => {

    const [stuff, setStuff] = useState(
        {
            kalk3y: '',
            gform: '',
        }
    )

    const {state, handlePost} = usePost();

    useEffect(() => {
        console.log(state.data);
    })
    
    useEffect(() => {
        console.log(state.data);
    }, [state])

    return (
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height:'100vh',
        }} maxWidth="sm">
            <div>
                <h1>Kal Page</h1>
                <TextField
                fullWidth
                style={{marginTop: '1rem'}}
                label="Kal-k3y"
                value={stuff.kalk3y}
                onChange={(e) => setStuff({...stuff, kalk3y: e.target.value})}
                />
                <TextField
                style={{marginTop: '1rem'}}
                fullWidth
                label="Google Form"
                value={stuff.gform}
                onChange={(e) => setStuff({...stuff, gform: e.target.value})}
                />
                <button onClick={() => {
                    handlePost(import.meta.env.VITE_APPLICATION_TEST_SERVER_URL+'thekalzone', stuff);
                }} style={{marginTop:'1rem'}} className='full-width'>Send forms</button>
            </div>
        </Container>
    );
}

export default KalPage;