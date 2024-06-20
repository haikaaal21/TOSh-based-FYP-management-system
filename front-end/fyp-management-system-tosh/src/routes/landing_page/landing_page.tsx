import Footer from '../../components/landing_page/footer';
import './landing_page_style.css';
import LaptopImage from '../../assets/images/landing_page/laptop.png';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import SparesLogoFull from '../../components/svgcomponents/spares_logo_full';
import styled from 'styled-components';
import { Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import {
  MdBook,
  MdCheckBox,
  MdCookie,
  MdDesignServices,
  MdLogin,
  MdPersonAdd,
  MdTimer,
} from 'react-icons/md';
import { useNavigate } from 'react-router';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import { IoDesktop, IoHappy, IoSad } from 'react-icons/io5';
import TableOfShame from '../../components/TableOfShame';
import { BsPeople } from 'react-icons/bs';
import { IoMdHeart } from 'react-icons/io';
const CustomA = styled.a`
  width: 120px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover * {
    transition: 0.3s ease-out;
    fill: yellow;
  }
`;

interface HighlightProps {
  inView: any;
  title: string;
  description: string;
  icon: any;
}
const Highlight = React.forwardRef((props: HighlightProps, ref: any) => {
  return (
    <Grid
      sx={{ justifyContent: 'center', display: 'flex', marginTop: '80px' }}
      item
      xs={12}
      md={3.8}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.98, translateY: 25 }}
        animate={props.inView ? { opacity: 1, translateY: 0, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div
          style={{
            backgroundColor: 'white',
            width: 'fit-content',
            color: 'var(--SparesIndigo)',
            borderRadius: '80%',
            padding: '10px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {props.icon}
        </div>
        <h3 style={{ marginTop: '25px' }}>{props.title}</h3>
        <p>{props.description}</p>
      </motion.div>
    </Grid>
  );
});

export default function LandingPage() {
  const goto = useNavigate();

  useEffect(() => {
    document.title = 'SPARES | Home';
  }, []);

  const gotoLogin = (really: boolean) => {
    if (really) goto('/login');
    else goto('/register');
  };
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const { ref: secondref, inView: secondView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const { ref: thirdref, inView: thirdView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const { ref: tableRef, inView: tableView2 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const {ref: creditsRef, inView: creditsView} = useInView({
    triggerOnce: true,
    threshold: 1
  })

  const { scrollYProgress } = useScroll();

  const [dialog,setDialog] = useState(true)

  const names = ['Family','TinkeringTurian','HasyaHasyiii','Arting', 'ArberJeki', 'Abigell', 'BimoBimskyy', 'MasReee', 'Fatraaaa', 'Ganangg', 'Rafii', 'L', 'anisfmtnz', 'redcore33', 'kaachang', 'joovis', 'adaadaamm', 'Ashton', 'manggar', 'babehh', 'adit', 'utin', 'athena', 'aan']
  

  return (
    <div className="container">
      <Dialog open={dialog} onClose={() => {}}>
        <DialogTitle style={{justifyContent:'flex-start'}} ><MdCookie />&nbsp;This website uses Cookies and Local storage</DialogTitle>
        <Divider />
        <DialogContent>
          <p style={{textAlign:'justify'}}>
            This website uses cookies and local storage to store your session
            data and preferences. By using this website you agree to the use of
            cookies and local storage.
          </p>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setDialog(false)} className='buttonWithLeading'><MdCheckBox />&nbsp;I agree</button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="xl">
        <div style={{
          padding:'0 20px',
          backgroundColor: `rgba(0, 0, 0, ${scrollYProgress.get()})`,
          transition: 'background-color 0.3s ease-out'
        }} className="nav">
          <CustomA href="#">
            <SparesLogoFull fill2="white" fill="white" />
          </CustomA>
          <a className="hide-if-mobile" href="#about">
            About
          </a>
          <a className="hide-if-mobile" href="#hall-of-shame">
            Hall of Shame
          </a>
          <a className="hide-if-mobile" href="#credits">
            Credits
          </a>
          <button
            onClick={() => {
              gotoLogin(true);
            }}
            className="buttonWithLeading">
            <MdLogin />
            &nbsp;Login
          </button>
        </div>
        <motion.div
          className="hero"
          initial={{ opacity: 0, scale: 0.98, translateY: 25 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ duration: 1 }}>
          <Typography
            style={{ fontFamily: 'Inter', fontWeight: 'bold' }}
            variant="h1">
            {' '}
            Putting the <b>P</b> of <b>Pressure</b> in your institution's FY
            <b>P</b>
          </Typography>
          <p style={{ maxWidth: '800px' }}>
            SPARES is an application for institutions to manage their Final Year
            Project coordination between Students, Lecturers, and Coordinators
            of the annual Final Year Project Creation.
          </p>
          <button
            style={{
              marginTop: '10px',
              color: 'black',
              backgroundColor: 'white',
            }}
            onClick={() => {
              gotoLogin(false);
            }}
            className="buttonWithLeading">
            <MdPersonAdd />
            &nbsp;Get Started
          </button>
          <img
            src={LaptopImage}
            alt="Laptop"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              maxHeight: '600px',
              maxWidth: '1000px',
            }}
          />
        </motion.div>
        <div id="about" style={{ paddingTop: '150px' }}>
          <Grid gap={1} style={{ justifyContent: 'center' }} container>
            <Highlight
              ref={ref}
              inView={inView}
              title="User Friendly Design"
              description="An easily put together design for mobile and PC use."
              icon={<MdDesignServices size={50} />}
            />
            <Highlight
              ref={secondref}
              inView={secondView}
              title="Real Time Shame points"
              description="Points of shame are added to users who did not submit their assignment on time."
              icon={<MdTimer size={50} />}
            />
            <Highlight
              ref={thirdref}
              inView={thirdView}
              title="Shame as a pressure tool"
              description="Put your students and supervisors to shame if a task is overdue or late."
              icon={<IoSad size={50} />}
            />
          </Grid>
        </div>
        <motion.div
          initial={{ opacity: 0, translateY: 125 }}
          animate={tableView2 ? { opacity: 1, translateY: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={tableRef}
          className="min-height"
          id="hall-of-shame">
          <Typography
            style={{ paddingTop: '150px', fontWeight: 'bold' }}
            variant="h3">
            Hall of <b style={{ color: 'var(--SparesRed)' }}>Shame</b>
          </Typography>
          <p>
            Our Hall of Shame is a list of users who have not submitted their
            assignments on time. This is a way to put pressure on users to
            submit their assignments on time.
          </p>
          <TableOfShame />
          <p
            className="subtitle"
            style={{ color: 'white', textAlign: 'right' }}>
            *This is a real-time table of users with shame points
          </p>
        </motion.div>
        <motion.div style={{marginTop:'8rem'}} id='credits'>
          <BsPeople size={72} />
          <h3 style={{color:'var(--SparesLightBlue)'}}>Credits</h3>
          <h2 className='with-leading' style={{justifyContent:'center'}}><IoDesktop />&nbsp;Programming and Designing : Muhammad Haikal</h2>
          <h2 className='with-leading' style={{justifyContent:'center'}}><MdBook />&nbsp;Supervisor and Mentoring : Ahmad Hanis Bin Mohd Sabli</h2>
            <IoHappy size={34}  style={{marginTop:'15px'}}/>
          <h3>Special thank you for these special people:</h3>
          <AnimatePresence>
            <motion.div
            style={{display:'flex', alignItems:'center', justifyContent:'center'}}
              ref={creditsRef}
              initial={{ opacity: 0 }}
              animate={creditsView ? { opacity: 1 } : {}}
              exit={{ opacity: 0 }}
            >
            <p>
              {
                names.map((name, index) => {
                  return (
                    <span key={index}>{name} &nbsp;</span>
                  )
                })
              }  
            </p>
            </motion.div>
          </AnimatePresence>
          <p>And other friends who supported me along the way.</p>
          <p className='subtitle buttonWithLeading'><IoMdHeart />&nbsp;Thank you for being there through my thick and thin</p>
        </motion.div>
        <Footer />
      </Container>
    </div>
  );
}
