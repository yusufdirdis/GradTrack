
import React from 'react';
import { SparklesIcon } from './Icons';

interface SuggestionChipsProps {
    suggestions: string[];
    onChipClick: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onChipClick }) => {
    return (
        <div className="mt-4 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Here are some ideas to get you started:
            </h3>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onChipClick(suggestion)}
                        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestionChips;
