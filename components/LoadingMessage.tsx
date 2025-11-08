
import React from 'react';
import { BotIcon } from './Icons';

export const LoadingMessage: React.FC = () => {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <BotIcon className="w-5 h-5" />
            </div>
            <div className="max-w-xl p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm rounded-tl-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
            </div>
        </div>
    );
};
