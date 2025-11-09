
import React, { useRef } from 'react';
import type { FlowchartData } from '../types';
import { ArrowDownIcon, BookOpenIcon, CalendarIcon, DownloadIcon } from './Icons';

interface FlowchartProps {
    data: FlowchartData;
    onCourseClick: (courseName: string) => void;
}

const Flowchart: React.FC<FlowchartProps> = ({ data, onCourseClick }) => {
    const flowchartRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = flowchartRef.current;
        if (!input) return;

        // @ts-ignore
        const { jsPDF } = window.jspdf;
        // @ts-ignore
        const html2canvas = window.html2canvas;

        html2canvas(input, { 
            scale: 2, // Higher scale for better quality
            useCORS: true, // In case any images are loaded
            backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color')
        }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgHeight = pdfWidth / ratio;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            pdf.save(`study-plan-${data.career.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        });
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-2" />
                    Study Plan
                </h2>
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 py-1.5 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                    aria-label="Download study plan as PDF"
                >
                    <DownloadIcon className="w-4 h-4" />
                    Download PDF
                </button>
            </div>
           
            <div ref={flowchartRef} className="p-2">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">{data.career}</h3>
                <div className="relative pl-6">
                    {/* Vertical line running through all plans */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" style={{left: '2px'}}></div>

                    {data.plans.map((plan, planIndex) => (
                        <div key={plan.institution} className="mb-4">
                            <div className="mb-8 relative">
                                {/* Dot for the institution header */}
                                <div className="absolute -left-8 top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                                <div className="pl-2">
                                    <h4 className="text-md font-bold text-gray-800 dark:text-gray-200">{plan.institution}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.degree}</p>
                                </div>
                            </div>

                            {plan.timeline.map((term, termIndex) => (
                                <div key={term.term} className="mb-8 relative">
                                    {/* Dot on the timeline for each term */}
                                    <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                                    
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                        <h4 className="font-bold text-md text-blue-500 dark:text-blue-400">{term.term}</h4>
                                        <div className="mt-3">
                                            <h5 className="text-sm font-semibold mb-2 flex items-center text-gray-600 dark:text-gray-400">
                                                <BookOpenIcon className="w-4 h-4 mr-2" /> Courses
                                            </h5>
                                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                {term.courses.map(course => (
                                                    <li key={course}>
                                                        <button 
                                                            onClick={() => onCourseClick(course)}
                                                            className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            aria-label={`Get details for course: ${course}`}
                                                        >
                                                            {course}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Show arrow if it's not the very last term of the very last plan */}
                                    {!(planIndex === data.plans.length - 1 && termIndex === plan.timeline.length - 1) && (
                                        <div className="absolute -left-5 mt-4 text-gray-400">
                                            <ArrowDownIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Flowchart;
