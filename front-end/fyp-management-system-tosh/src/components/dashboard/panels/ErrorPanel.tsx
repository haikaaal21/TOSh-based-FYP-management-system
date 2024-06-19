import { MdLogout, MdRestartAlt } from 'react-icons/md';
import ErrorImg from '../../../assets/images/error.png';
import { Link } from 'react-router-dom';

interface ErrorPanelProps {
  isItProfile?: boolean;
  logout?: () => void;
}
const ErrorPanel: React.FC<ErrorPanelProps> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        textAlign: 'center',
      }}>
      <img style={{ maxWidth: '300px' }} src={ErrorImg} alt="" />
      <h1>Whoops!</h1>
      <p>Looks like we could not connect to our dedicated server!</p>
      <button
        style={{ color: 'var(--IndicatorBlue)', cursor: 'pointer' }}
        className="buttonWithLeading"
        onClick={() => {
          window.location.reload();
        }}>
        <MdRestartAlt />
        &nbsp;Click here to try again.
      </button>
      {props.isItProfile && props.logout ? (
        <Link
          className="with-leading"
          style={{ color: 'var(--IndicatorRed)' }}
          to="">
          or&nbsp;
          <MdLogout />
          &nbsp;Logout?
        </Link>
      ) : null}
    </div>
  );
};

export default ErrorPanel;
