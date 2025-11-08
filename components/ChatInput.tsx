
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSend(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a career path..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />
            <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-500 text-white disabled:bg-gray-400 disabled:dark:bg-gray-600 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </form>
    );
};

export default ChatInput;
