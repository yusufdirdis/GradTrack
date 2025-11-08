
import React, { useState } from 'react';
import { MailIcon, DownloadIcon, XIcon, CheckCircleIcon } from './Icons';

interface PdfEmailModalProps {
    content: string;
    onClose: () => void;
}

const PdfEmailModal: React.FC<PdfEmailModalProps> = ({ content, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleDownload = () => {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 15, 20);
        doc.save('career_summary.pdf');
    };

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a simulation. In a real app, this would call a backend service.
        console.log(`Simulating sending PDF to ${email}`);
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-4">Export Summary</h2>
                
                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Download a copy of the summary as a PDF document.</p>
                    <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        <DownloadIcon className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {isSent ? (
                        <div className="flex flex-col items-center justify-center text-center text-green-500">
                             <CheckCircleIcon className="w-12 h-12 mb-2"/>
                             <p className="font-semibold">Email Sent!</p>
                             <p className="text-sm">A copy has been sent to {email}.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSendEmail}>
                             <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Or, send it directly to your email (simulation).</p>
                             <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <button type="submit" className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                    <MailIcon className="w-5 h-5" />
                                    Send
                                </button>
                             </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfEmailModal;
