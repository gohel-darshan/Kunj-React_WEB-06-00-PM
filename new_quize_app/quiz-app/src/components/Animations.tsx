import React from 'react';
import { useSpring, animated } from 'react-spring';

export const FadeIn = ({ children }) => {
    const props = useSpring({ opacity: 1, from: { opacity: 0 } });
    return <animated.div style={props}>{children}</animated.div>;
};

export const SlideIn = ({ children }) => {
    const props = useSpring({ transform: 'translateX(0)', from: { transform: 'translateX(-100%)' } });
    return <animated.div style={props}>{children}</animated.div>;
};

export const ScaleUp = ({ children }) => {
    const props = useSpring({ transform: 'scale(1)', from: { transform: 'scale(0)' } });
    return <animated.div style={props}>{children}</animated.div>;
};

export const Bounce = ({ children }) => {
    const props = useSpring({
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(-10px)' },
        config: { tension: 300, friction: 10 },
        reset: true,
        reverse: true,
    });
    return <animated.div style={props}>{children}</animated.div>;
};