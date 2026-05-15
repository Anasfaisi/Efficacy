import React, { createContext, useContext } from 'react';
import type { TimeContextType } from '../types';
import { TimeContextMessages } from '@/utils/Constants';

export const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTime = () => {
    const context  = useContext(TimeContext)
    if(context === undefined)throw new Error(TimeContextMessages.ContextError)
    return context
};


