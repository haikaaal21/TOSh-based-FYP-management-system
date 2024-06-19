import { Link } from 'react-router-dom';
import image404 from '../../../assets/images/notfound.png';

const NoPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '850px',
        maxWidth: '100%',
      }}
      className="no-page">
      <img
        style={{ padding: '10px', maxWidth: '300px' }}
        src={image404}
        alt=""
      />
      <h3>Uh oh...</h3>
      <h1>404</h1>
      <h3>Something's missing.</h3>
      <p>
        The page you're trying to navigate to is missing or you've assembled the
        link incorrectly,
      </p>
      <Link style={{ color: 'var(--IndicatorBlue)' }} to="./">
        Click here to go back to home.
      </Link>
    </div>
  );
};

export default NoPage;
