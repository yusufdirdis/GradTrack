
export interface Message {
    id: number;
    role: 'user' | 'model' | 'system';
    text: string;
    groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    }
}

export interface ToolCall {
    id: string;
    name: string;
    args: any;
}

export interface ToolCallResponse {
    id: string;
    name: string;
    response: any;
}

export interface Term {
    term: string;
    courses: string[];
}

export interface DegreePlan {
    institution: string;
    degree: string;
    timeline: Term[];
}

export interface FlowchartData {
    career: string;
    plans: DegreePlan[];
}
