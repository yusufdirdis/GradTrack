
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Message, ToolCall, ToolCallResponse, FlowchartData } from './types';
import { initializeChat, sendMessageToAI, getFlowchartData, analyzeCareerPotential, getTeacherReviews, findTeachers, getCourseSummary, getTuitionEstimate, getTransferOptions } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Flowchart from './components/Flowchart';
import { Header } from './components/Header';
import PdfEmailModal from './components/PdfEmailModal';
import SuggestionChips from './components/SuggestionChips';

const App: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showFlowchart, setShowFlowchart] = useState<FlowchartData | null>(null);
    const [pdfExportContent, setPdfExportContent] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const flowchartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const init = async () => {
            const newChat = await initializeChat();
            setChat(newChat);
            setMessages([
                {
                    id: Date.now(),
                    role: 'model',
                    text: "Hello! I'm your AI career advisor. How can I help you plan your future today? You can ask me about career paths, study plans, tuition costs, and more. If you're not sure where to start, I can analyze your interests and skills to suggest some career paths for you!",
                },
            ]);
        };
        init();
    }, []);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if(showFlowchart && flowchartContainerRef.current) {
            flowchartContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showFlowchart]);
    
    const handleToolCall = useCallback(async (toolCall: ToolCall) => {
        let toolResponse: ToolCallResponse | null = null;
        setMessages(prev => [...prev, {id: Date.now(), role: 'system', text: `Using tool: ${toolCall.name}`}]);

        switch(toolCall.name) {
            case 'generate_study_flowchart':
                try {
                    const { career, startDate, coursesPerTerm, targetUniversity, bachelorsDegree } = toolCall.args;
                    const data = await getFlowchartData(career, startDate, coursesPerTerm, targetUniversity, bachelorsDegree);
                    setShowFlowchart(data);
                    
                    let successMessage;
                    if (targetUniversity) {
                        successMessage = `The complete 4-year study plan for your degree in ${career}, transferring to ${targetUniversity}, has been generated.`;
                    } else {
                        successMessage = `The flowchart for your Associate's degree in ${toolCall.args.career} has been generated. Would you like to plan for a Bachelor's degree next? If so, let me know which university you're considering for a transfer. MDC has excellent transfer agreements with many universities like FIU, UCF, and UF.`;
                    }
                    
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: successMessage } };
                } catch (error) {
                    console.error("Flowchart generation failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error generating flowchart.` } };
                }
                break;
            case 'offer_pdf_export':
                 try {
                    const { content } = toolCall.args;
                    setPdfExportContent(content);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: "PDF export options are now visible to the user." } };
                } catch (error) {
                    console.error("PDF export failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error offering PDF export.` } };
                }
                break;
            case 'analyze_career_potential':
                try {
                    const analysis = await analyzeCareerPotential(toolCall.args.interests, toolCall.args.skills, toolCall.args.resumeText);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Career analysis complete.`, data: analysis } };
                } catch (error) {
                    console.error("Career analysis failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error analyzing career potential.` } };
                }
                break;
            case 'get_tuition_estimate':
                try {
                    const { career, university } = toolCall.args;
                    const estimate = await getTuitionEstimate(career, university);
                    const institutionName = university || 'Miami Dade College';
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Tuition estimate for ${career} at ${institutionName} fetched`, data: estimate } };
                } catch (error) {
                    console.error("Tuition estimation failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error estimating tuition.` } };
                }
                break;
            case 'get_course_summary':
                try {
                    const summary = await getCourseSummary(toolCall.args.career, toolCall.args.courseName);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Summary for ${toolCall.args.courseName} fetched`, data: summary } };
                } catch (error) {
                    console.error("Course summary fetching failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error fetching course summary.` } };
                }
                break;
            case 'get_teacher_reviews':
                try {
                    const reviews = await getTeacherReviews(toolCall.args.teacherName, toolCall.args.courseName);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Reviews fetched`, data: reviews } };
                } catch (error) {
                    console.error("Review fetching failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error fetching reviews.` } };
                }
                break;
            case 'find_teachers':
                try {
                    const teachers = await findTeachers(toolCall.args.sortBy, toolCall.args.courseName);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Teachers list fetched`, data: teachers } };
                } catch (error) {
                    console.error("Teacher finding failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error finding teachers.` } };
                }
                break;
            case 'get_transfer_options':
                try {
                    const options = await getTransferOptions(toolCall.args.major, toolCall.args.targetUniversity);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: true, message: `Transfer options fetched.`, data: options } };
                } catch (error) {
                    console.error("Transfer options fetching failed:", error);
                    toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: `Error fetching transfer options.` } };
                }
                break;
            default:
                console.warn(`Unknown tool call: ${toolCall.name}`);
                toolResponse = { id: toolCall.id, name: toolCall.name, response: { success: false, message: 'Unknown tool.' } };
        }
        return toolResponse;
    }, []);

    const handleSend = useCallback(async (inputText: string) => {
        if (!inputText.trim() || isLoading || !chat) return;

        setShowSuggestions(false);
        setIsLoading(true);
        const userMessage: Message = { id: Date.now(), role: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);

        try {
            let response = await sendMessageToAI(chat, inputText);
            
            while(response.functionCalls && response.functionCalls.length > 0) {
                 const toolCall = response.functionCalls[0];
                 const toolResponse = await handleToolCall(toolCall);
                 if (toolResponse) {
                    response = await sendMessageToAI(chat, "", toolResponse);
                 } else {
                    break;
                 }
            }
            
            const modelMessage: Message = { id: Date.now() + 1, role: 'model', text: response.text, groundingChunks: response.groundingChunks };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            
            let displayMessage = 'Sorry, I encountered an error. Please try again.';

            // Check for specific rate limit error from Gemini API
            if (error instanceof Error && error.message) {
                if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
                     displayMessage = "I'm experiencing high demand right now and have reached my request limit. Please wait a moment before trying again.";
                }
            }
            
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'model',
                text: displayMessage,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [chat, isLoading, handleToolCall]);
    
    const handleCourseClick = useCallback(async (courseName: string) => {
        if (isLoading) return;

        // Scroll main chat into view in case user is scrolled down on the flowchart panel
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        await handleSend(`Give me a summary for the course: "${courseName}"`);
        await handleSend(`Find the top 3 teachers with the highest rating for the course: "${courseName}"`);
    }, [isLoading, handleSend]);

    const initialSuggestions = [
        "Analyze my potential based on my interests in art and technology.",
        "Create a 2-year study plan for an Associate's in Nursing at MDC.",
        "How much does tuition for a Computer Science degree cost?",
        "What are the best transfer options from MDC to FIU for a business major?",
    ];

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header />
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <main ref={chatContainerRef} className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
                    <ChatWindow messages={messages} isLoading={isLoading} />
                     {showSuggestions && (
                        <SuggestionChips suggestions={initialSuggestions} onChipClick={handleSend} />
                    )}
                </main>
                {showFlowchart && (
                    <aside ref={flowchartContainerRef} className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 p-4 md:p-6 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto shadow-lg md:shadow-none">
                        <Flowchart data={showFlowchart} onCourseClick={handleCourseClick} />
                    </aside>
                )}
            </div>
            <div className="p-4 md:px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
             {pdfExportContent && (
                <PdfEmailModal 
                    content={pdfExportContent} 
                    onClose={() => setPdfExportContent(null)} 
                />
            )}
        </div>
    );
};

export default App;
