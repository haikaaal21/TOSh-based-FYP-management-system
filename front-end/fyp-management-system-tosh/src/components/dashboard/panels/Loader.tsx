import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  const [time, settime] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      settime((time) => time - 1);
    }, 1000);
    if (time === 0) {
      clearInterval(interval);
      window.location.reload();
    }
    return () => clearInterval(interval);
  }, [time]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        type: 'tween',
        damping: 20,
      }}
      animate={{ opacity: 1 }}
      className="loader">
      <ThreeDots wrapperClass="loader-item" color="var(--SparesOrange)" />
      <p>Refreshing in {time} seconds</p>
    </motion.div>
  );
};

export default Loader;
