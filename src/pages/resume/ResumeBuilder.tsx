
import { useState } from "react";
import ResumeNavbar from "@/components/resume/ResumeNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Download, Save } from "lucide-react";
import { toast } from "sonner";

// Type definitions for Resume Data
interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    link: string;
}

interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;
    skills: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
}

const initialData: ResumeData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    education: [],
    experience: [],
    projects: []
};

const sampleData: ResumeData = {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    summary: "Experienced Full Stack Developer with a passion for building scalable web applications. Proven track record in delivering high-quality code and leading agile teams.",
    skills: "React, TypeScript, Node.js, PostgreSQL, AWS, Docker",
    education: [
        { id: "1", school: "University of California, Berkeley", degree: "B.S. Computer Science", year: "2020" }
    ],
    experience: [
        { id: "1", company: "Tech Solutions Inc.", role: "Senior Developer", duration: "2022 - Present", description: "Led development of core platform features. Improved performance by 40%." },
        { id: "2", company: "WebCorp", role: "Frontend Developer", duration: "2020 - 2022", description: "Developed responsive UI components using React and Redux." }
    ],
    projects: [
        { id: "1", name: "E-commerce Platform", description: "A full-featured online store with payment integration.", link: "github.com/alexmorgan/shop" }
    ]
};

const ResumeBuilder = () => {
    const [data, setData] = useState<ResumeData>(initialData);

    const handleInputChange = (field: keyof ResumeData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleLoadSample = () => {
        setData(sampleData);
        toast.success("Sample data loaded");
    };

    // Helper to add/remove items usually requires more complex logic, 
    // keeping it simple for "skeleton" as requested, but implementing basic add/remove for completeness.
    const addItem = <T extends { id: string }>(field: keyof Pick<ResumeData, 'education' | 'experience' | 'projects'>, item: T) => {
        setData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    };

    const removeItem = (field: keyof Pick<ResumeData, 'education' | 'experience' | 'projects'>, id: string) => {
        setData(prev => ({ ...prev, [field]: prev[field].filter(i => i.id !== id) }));
    };

    // Simple Resume View Component
    const ResumePreviewView = ({ data }: { data: ResumeData }) => (
        <div className="bg-white text-black p-8 min-h-[1056px] shadow-sm font-serif">
            <header className="border-b-2 border-black pb-4 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{data.fullName || "Your Name"}</h1>
                <div className="flex flex-wrap gap-3 text-sm font-sans text-gray-600">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>• {data.phone}</span>}
                    {data.location && <span>• {data.location}</span>}
                    {data.linkedin && <span>• {data.linkedin}</span>}
                    {data.github && <span>• {data.github}</span>}
                </div>
            </header>

            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Summary</h2>
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                </section>
            )}

            {data.skills && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Skills</h2>
                    <p className="text-sm leading-relaxed">{data.skills}</p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{exp.role}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div className="text-sm font-semibold mb-1">{exp.company}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{proj.name}</span>
                                    {proj.link && <span className="text-xs text-gray-500">{proj.link}</span>}
                                </div>
                                <p className="text-sm text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Education</h2>
                    <div className="space-y-2">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-sm">
                                <div>
                                    <span className="font-bold block">{edu.school}</span>
                                    <span>{edu.degree}</span>
                                </div>
                                <span className="font-semibold">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col">
            <ResumeNavbar />

            <main className="flex-1 container max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">

                {/* Left Column: Form */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold">Editor</h2>
                        <Button variant="outline" size="sm" onClick={handleLoadSample}>
                            Load Sample Data
                        </Button>
                    </div>

                    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                        <div className="space-y-6 pb-20">
                            {/* Personal Info */}
                            <Card>
                                <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input value={data.fullName} onChange={e => handleInputChange("fullName", e.target.value)} placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input value={data.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input value={data.phone} onChange={e => handleInputChange("phone", e.target.value)} placeholder="+1 555..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location</label>
                                        <Input value={data.location} onChange={e => handleInputChange("location", e.target.value)} placeholder="City, Country" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">LinkedIn</label>
                                        <Input value={data.linkedin} onChange={e => handleInputChange("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">GitHub</label>
                                        <Input value={data.github} onChange={e => handleInputChange("github", e.target.value)} placeholder="github.com/..." />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary */}
                            <Card>
                                <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={data.summary}
                                        onChange={e => handleInputChange("summary", e.target.value)}
                                        placeholder="Briefly describe your experience and goals..."
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            <Card>
                                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                                <CardContent>
                                    <Input
                                        value={data.skills}
                                        onChange={e => handleInputChange("skills", e.target.value)}
                                        placeholder="Java, Python, React, Communication (comma separated)"
                                    />
                                </CardContent>
                            </Card>

                            {/* Experience */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Experience</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => addItem('experience', { id: Date.now().toString(), company: 'New Company', role: 'Role', duration: 'Date', description: 'Description' })}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="p-4 border rounded-md space-y-3 relative group">
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => removeItem('experience', exp.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input value={exp.role} onChange={e => {
                                                    const newExp = data.experience.map(item => item.id === exp.id ? { ...item, role: e.target.value } : item);
                                                    setData({ ...data, experience: newExp });
                                                }} placeholder="Role" />
                                                <Input value={exp.company} onChange={e => {
                                                    const newExp = data.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                                                    setData({ ...data, experience: newExp });
                                                }} placeholder="Company" />
                                            </div>
                                            <Input value={exp.duration} onChange={e => {
                                                const newExp = data.experience.map(item => item.id === exp.id ? { ...item, duration: e.target.value } : item);
                                                setData({ ...data, experience: newExp });
                                            }} placeholder="Duration (e.g. 2020-2022)" />
                                            <Textarea value={exp.description} onChange={e => {
                                                const newExp = data.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                                                setData({ ...data, experience: newExp });
                                            }} placeholder="Description" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Projects */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Projects</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => addItem('projects', { id: Date.now().toString(), name: 'New Project', description: 'Description', link: '' })}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.projects.map(proj => (
                                        <div key={proj.id} className="p-4 border rounded-md space-y-3 relative group">
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => removeItem('projects', proj.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input value={proj.name} onChange={e => {
                                                    const newProjs = data.projects.map(item => item.id === proj.id ? { ...item, name: e.target.value } : item);
                                                    setData({ ...data, projects: newProjs });
                                                }} placeholder="Project Name" />
                                                <Input value={proj.link} onChange={e => {
                                                    const newProjs = data.projects.map(item => item.id === proj.id ? { ...item, link: e.target.value } : item);
                                                    setData({ ...data, projects: newProjs });
                                                }} placeholder="Link (Optional)" />
                                            </div>
                                            <Textarea value={proj.description} onChange={e => {
                                                const newProjs = data.projects.map(item => item.id === proj.id ? { ...item, description: e.target.value } : item);
                                                setData({ ...data, projects: newProjs });
                                            }} placeholder="Project Description" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Education */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Education</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => addItem('education', { id: Date.now().toString(), school: 'University', degree: 'Degree', year: 'Year' })}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="p-4 border rounded-md space-y-3 relative group">
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => removeItem('education', edu.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <Input value={edu.school} onChange={e => {
                                                const newEdu = data.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item);
                                                setData({ ...data, education: newEdu });
                                            }} placeholder="School / University" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input value={edu.degree} onChange={e => {
                                                    const newEdu = data.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                                                    setData({ ...data, education: newEdu });
                                                }} placeholder="Degree" />
                                                <Input value={edu.year} onChange={e => {
                                                    const newEdu = data.education.map(item => item.id === edu.id ? { ...item, year: e.target.value } : item);
                                                    setData({ ...data, education: newEdu });
                                                }} placeholder="Year" />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                        </div>
                    </ScrollArea>
                </div>

                {/* Right Column: Preview */}
                <div className="w-full lg:w-1/2 flex flex-col h-[calc(100vh-100px)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-serif font-bold">Live Preview</h2>
                        <Button size="sm" variant="ghost" className="opacity-50 cursor-not-allowed" title="Export disabled in skeleton">
                            <Download className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border shadow-inner">
                        <ScrollArea className="h-full w-full p-8 flex justify-center">
                            <div className="origin-top scale-[0.8] lg:scale-90 transition-transform">
                                <ResumePreviewView data={data} />
                            </div>
                        </ScrollArea>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ResumeBuilder;
