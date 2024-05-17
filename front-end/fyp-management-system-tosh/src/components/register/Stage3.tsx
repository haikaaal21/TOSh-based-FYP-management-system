import { useContext, useEffect } from 'react';
import AccountContext from '../../context/AccountContext';

const Stage3 = ({ setStage }: { setStage: (stage: number) => void }) => {
  const { account, replaceAccount } = useContext(AccountContext);

  const packageAccount = () => {
    let processingAccount = {} as any;
    account.typeOfAccount === 'Student'
      ? (processingAccount = {
          name: account.firstName + ' ' + account.lastName,
          email: account.email.toLowerCase(),
          password: account.password,
          dob: account.dateOfBirth,
          institution: account.institution,
          matricNumber: account.matricNumber,
        })
      : (processingAccount = {
          name: account.firstName + ' ' + account.lastName,
          email: account.email.toLowerCase(),
          password: account.password,
          dob: account.dateOfBirth,
          institution: account.institution,
          matricNumber: account.matricNumber,
          typeOfStaff: account.typeOfStaff,
        });
    replaceAccount(processingAccount);
  };

  useEffect(() => {
    packageAccount();
  }, []);

  useEffect(() => {
    setStage(4);
  }, [account]);

  return (
    <div>
      <p>Preparing your account . . .</p>
    </div>
  );
};

export default Stage3;
