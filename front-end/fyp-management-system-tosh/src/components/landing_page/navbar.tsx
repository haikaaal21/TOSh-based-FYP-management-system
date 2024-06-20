import styled from 'styled-components';
import SparesLogoFull from '../svgcomponents/spares_logo_full';

//!! Make the Props!!

const CustomNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 0% 5%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  li a {
    color: white;
    text-decoration: none;
    transition: 0.3s ease-in-out;
  }

  @media (min-width: 768px) {
    li a:hover {
      color: yellow;
      letter-spacing: 1.5px;
    }
  }

  ul li {
    padding: 0 1rem;
  }
`;

const CustomHeader = styled.header`
  @media (max-width: 768px) {
    #web {
      display: none;
    }
  }

  @media (min-width: 768px) {
    #mobile {
      display: none;
    }
  }
`;

//! Do this!
function openNav() {
  const mobileSideNav = document.getElementById('#mobile-sideNav');
  if (mobileSideNav) {
    mobileSideNav.style.height = '100%';
  }
}

function navigateToRegister() {
  window.location.href = '/register';
}

const Navbar = () => {
  return (
    <CustomHeader>
      <CustomNav id="mobile">
        <CustomA href="/">
          <SparesLogoFull fill2="white" fill="white" />
        </CustomA>
        <div>
          <button onClick={openNav} style={{ backgroundColor: 'transparent' }}>
            <p>Burger here</p>
          </button>
        </div>
      </CustomNav>
      <CustomNav id="web">
        <CustomA href="/">
          <SparesLogoFull fill2="white" fill="white" />
        </CustomA>
        <ul
          style={{
            display: 'flex',
            listStyleType: 'none',
            justifyContent: 'space-around',
            padding: '0 2rem',
          }}>
          <li>
            <a href="/#about">About</a>
          </li>
          <li>
            <a href="/#hall-of-shame">Hall of Shame</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
          </li>
        </ul>
        <div>
          <button
            type="button"
            onClick={navigateToRegister}
            style={{
              backgroundColor: 'white',
              color: 'var(--DarkBlue)',
            }}>
            Get Started
          </button>
        </div>
      </CustomNav>
    </CustomHeader>
  );
};

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

export default Navbar;
