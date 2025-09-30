import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WelcomeBackScreen = ({ onFinish }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onFinish) onFinish();
        }, 3000); // visible for 3 seconds
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black text-white text-3xl font-bold z-50"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                >
                    👋 Welcome Back!
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBackScreen;
