
export const splitTimeRange = (range: string): string[] => {
    const parts = range.toLowerCase().split('-').map(p => p.trim());
    if (parts.length !== 2) return [range];

    const parseTime = (timeStr: string) => {
      
        const match = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)?/);
        if (!match) return null;
        
        let [_, hours, mins, period] = match;
        let h = parseInt(hours);
        let m = mins ? parseInt(mins) : 0;
        

        if (!period) {
            if (h < 12) period = 'am'; 
            else period = ''; 
        }

        if (period === 'pm' && h < 12) h += 12;
        if (period === 'am' && h === 12) h = 0;
        
        return h * 60 + m;
    };

    const formatTime = (totalMinutes: number) => {
        let h = Math.floor(totalMinutes / 60);
        let m = totalMinutes % 60;
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const displayM = m.toString().padStart(2, '0');
        return `${displayH}:${displayM} ${period}`;
    };

    const start = parseTime(parts[0]);
    const end = parseTime(parts[1]);

    if (start === null || end === null) return [range];
    
    let actualEnd = end;
    if (actualEnd <= start) {
        actualEnd += 24 * 60;
    }

    const slots: string[] = [];
    let current = start;
    while (current + 60 <= actualEnd) {
        slots.push(`${formatTime(current)} - ${formatTime(current + 60)}`);
        current += 60;
    }

    if (slots.length === 0) return [range];

    return slots;
};

export const getAllSlots = (ranges: string[]): string[] => {
    return ranges.flatMap(range => splitTimeRange(range));
};
