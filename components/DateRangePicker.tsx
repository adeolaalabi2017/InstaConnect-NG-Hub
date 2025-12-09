import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onChange: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
    return (
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2">
            <Calendar size={16} className="text-gray-400" />
            <select
                className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"
                onChange={(e) => {
                    const val = e.target.value;
                    const end = new Date();
                    const start = new Date();
                    if (val === '7d') start.setDate(end.getDate() - 7);
                    if (val === '30d') start.setDate(end.getDate() - 30);
                    if (val === '90d') start.setDate(end.getDate() - 90);
                    onChange(start, end);
                }}
                defaultValue="30d"
            >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="year">This Year</option>
            </select>
        </div>
    );
};

export default DateRangePicker;
