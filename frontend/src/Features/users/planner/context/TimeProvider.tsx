import React, { useEffect, useState } from 'react';
import { TimeContext } from './TimeContext';

const TimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TimeContext.Provider value={{ currentTime: time }}>
            {children}
        </TimeContext.Provider>
    );
};

export default TimeProvider;
