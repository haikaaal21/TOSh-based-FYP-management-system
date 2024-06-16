import { motion } from 'framer-motion';

const TransitionHOC = (WrappedComponent: any) => {
  const Element = (props: any) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <WrappedComponent {...props} />
    </motion.div>
  );

  return <Element />;
};

export default TransitionHOC;
