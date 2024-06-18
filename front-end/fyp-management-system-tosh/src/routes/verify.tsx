import { MdCancel, MdCheckCircle, MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Footer from "../components/landing_page/footer";
import SparesLogoFull from "../components/svgcomponents/spares_logo_full";
import { Container } from "@mui/material";
import styled from "styled-components";
import { motion } from "framer-motion";
import useGet from "../hooks/api/useGet";

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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const VerificationPage = () => {
    const query = useQuery();
    const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
    const uid = query.get('uid');
    const key = query.get('key');
    const goto = useNavigate();
    const { state, handleGet } = useGet();
    const [data, setData] = useState<any>();
      
        useEffect(() => {
          document.title = 'SPARES | Verify';
            handleGet(url + 'user/verify/' + uid + '/' + key);
            if(!uid || !key) goto('/404');
        }, []);

        useEffect(() => {
            if (state.data) {
                setData(state.data);
            } else if (state.error) {
                goto('/404');
            }
          }, [state]);
      
        const gotoLogin = (really: boolean) => {
          if (really) goto('/login');
          else goto('/register');
        };

    return (
        <div className="container">
          <Container maxWidth="xl">
            <div className="nav">
              <CustomA href="./">
                <SparesLogoFull fill2="white" fill="white" />
              </CustomA>
              <a className="hide-if-mobile" href="#about">
                About
              </a>
              <a className="hide-if-mobile" href="#hall-of-shame">
                Hall of Shame
              </a>
              <a className="hide-if-mobile" href="#contact">
                Contact
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
            <div style={{height:'100vh', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
               {
                data ? (
                    <motion.div
                    initial={{ translateY: 20, opacity: 0 }}
                    animate={{
                        translateY: 0,
                        opacity: 1,
                        transition: { ease: 'easeOut' },
                    }}
                    exit={{ opacity: 0 }}
                >
                    {
                        data.verified ? <MdCheckCircle size={250} /> : <MdCancel size={250} />
                    }
                    <h2>{data? data.message : ''}</h2>
                    {data && data.verified? (
                        <p>You may now login to your account and get started on your FYP, happy studies!</p>
                    ) : null}
                </motion.div>
                ) : null
               }
            </div>
            <Footer />
          </Container>
        </div>
      );
}
export default VerificationPage;