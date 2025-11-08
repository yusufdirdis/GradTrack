
import React from 'react';
import type { Message } from '../types';
import { ChatMessage } from './Message';
import { ToolCallMessage } from './ToolCallMessage';
import { LoadingMessage } from './LoadingMessage';

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
    return (
        <div className="space-y-6">
            {messages.map((msg) => 
                msg.role === 'system' ? 
                <ToolCallMessage key={msg.id} text={msg.text} /> :
                <ChatMessage key={msg.id} message={msg} />
            )}
            {isLoading && <LoadingMessage />}
        </div>
    );
};

export default ChatWindow;
