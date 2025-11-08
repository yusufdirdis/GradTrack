
import React from 'react';
import { SettingsIcon } from './Icons';

interface ToolCallMessageProps {
    text: string;
}

export const ToolCallMessage: React.FC<ToolCallMessageProps> = ({ text }) => {
    return (
        <div className="flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <SettingsIcon className="w-4 h-4 animate-spin-slow" />
            <span>{text}</span>
        </div>
    );
};
