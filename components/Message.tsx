
import React from 'react';
import type { Message, GroundingChunk } from '../types';
import { BotIcon, UserIcon, GlobeIcon } from './Icons';

interface ChatMessageProps {
    message: Message;
}

const GroundingSources: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
    const sources = chunks.filter(chunk => chunk.web && chunk.web.uri);
    if (sources.length === 0) return null;

    return (
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-900">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <GlobeIcon className="w-4 h-4 mr-2" />
                Sources
            </h4>
            <div className="flex flex-wrap gap-2">
                {sources.map((chunk, index) => (
                    chunk.web && (
                        <a 
                            key={index}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors truncate max-w-xs"
                        >
                            {chunk.web.title || new URL(chunk.web.uri).hostname}
                        </a>
                    )
                ))}
            </div>
        </div>
    );
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === 'model';
    const formattedText = message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*/g, '<br/>');

    return (
        <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
            {isModel && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <BotIcon className="w-5 h-5" />
                </div>
            )}
            <div className={`max-w-xl p-4 rounded-2xl ${isModel ? 'bg-white dark:bg-gray-800 shadow-sm rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
                 <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedText }}></p>
                 {message.groundingChunks && <GroundingSources chunks={message.groundingChunks} />}
            </div>
            {!isModel && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};
