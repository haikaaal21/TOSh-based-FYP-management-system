import { ThreeDots } from 'react-loader-spinner';
import '../styles/loader.css';
import { motion } from 'framer-motion';

const Loading = () => {
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
    </motion.div>
  );
};

export default Loading;
