
export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link: string;
    liveUrl?: string;
    github?: string;
    techStack: string[];
}

export interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;

    skills: {
        technical: string[];
        soft: string[];
        tools: string[];
    };

    education: Education[];
    experience: Experience[];
    projects: Project[];
    selectedTemplate: 'modern' | 'classic' | 'minimal';
    themeColor: string; // New field
}

export const initialData: ResumeData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: {
        technical: [],
        soft: [],
        tools: []
    },
    education: [],
    experience: [],
    projects: [],
    selectedTemplate: 'modern',
    themeColor: "hsl(168, 60%, 40%)" // Default Teal
};
