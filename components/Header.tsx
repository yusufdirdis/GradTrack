
import React from 'react';
import { BotIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <BotIcon className="w-8 h-8 text-blue-500" />
            <div>
                <h1 className="text-lg font-bold">Career Path AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Personal Career Advisor</p>
            </div>
        </header>
    );
};
