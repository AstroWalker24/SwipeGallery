export const tabVariants = {
    active: {
        opacity:1,
        scale:1.1,
        y:0
    },
    inactive:{
        opacity:0.6,
        scale:1,
        y:2
    }
};

export const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}



