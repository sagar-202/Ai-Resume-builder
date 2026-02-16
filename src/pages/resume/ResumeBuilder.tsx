
import { useState, useEffect } from "react";
import ResumeNavbar from "@/components/resume/ResumeNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Download, Sparkles, AlertCircle, Lightbulb, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResumeData, initialData } from "@/types/resume";
import ResumePreviewView from "@/components/resume/ResumePreviewView";
import TagInput from "@/components/ui/TagInput";
import { calculateATSScore, ATSResults } from "@/lib/ats-scorer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const sampleData: ResumeData = {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    summary: "Experienced Full Stack Developer with 5+ years of expertise. Built scalable web applications using React and Node.js. Led a team of 4 developers to successful product launch.",
    skills: {
        technical: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
        soft: ["Team Leadership", "Agile"],
        tools: ["Docker", "Git", "Jira"]
    },
    education: [
        { id: "1", school: "University of California, Berkeley", degree: "B.S. Computer Science", year: "2020" }
    ],
    experience: [
        { id: "1", company: "Tech Solutions Inc.", role: "Senior Developer", duration: "2022 - Present", description: "• Led development of core platform features.\n• Improved performance by 40% using React and Redux." },
    ],
    projects: [
        {
            id: "1",
            name: "E-commerce Platform",
            description: "A full-featured online store.",
            link: "",
            liveUrl: "https://shop-demo.com",
            github: "https://github.com/alex/shop",
            techStack: ["Next.js", "Stripe", "Tailwind"]
        }
    ],
    selectedTemplate: 'modern',
    themeColor: "hsl(168, 60%, 40%)" // Teal default
};

const STORAGE_KEY = "resumeBuilderData";
const ACTION_VERBS = /^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated|Managed|Orchestrated|Spearheaded|Launched|Initiated|Executed|Formulated|Coordinated|Established)/i;

const THEME_COLORS = [
    { name: "Teal", value: "hsl(168, 60%, 40%)", bg: "bg-teal-700" },
    { name: "Navy", value: "hsl(220, 60%, 35%)", bg: "bg-blue-900" },
    { name: "Burgundy", value: "hsl(345, 60%, 35%)", bg: "bg-rose-900" },
    { name: "Forest", value: "hsl(150, 50%, 30%)", bg: "bg-green-800" },
    { name: "Charcoal", value: "hsl(0, 0%, 25%)", bg: "bg-neutral-800" },
];

const ResumeBuilder = () => {
    const [data, setData] = useState<ResumeData>(initialData);
    const [ats, setAts] = useState<ATSResults>({ score: 0, level: "Needs Work", color: "text-red-500", suggestions: [] });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // Load & Migrate data
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (typeof parsed.skills === 'string') {
                    const skillsArray = parsed.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
                    parsed.skills = { technical: skillsArray, soft: [], tools: [] };
                }

                if (!parsed.selectedTemplate) parsed.selectedTemplate = 'modern';
                if (!parsed.themeColor) parsed.themeColor = "hsl(168, 60%, 40%)";

                if (parsed.projects) {
                    parsed.projects = parsed.projects.map((p: any) => ({
                        ...p,
                        techStack: Array.isArray(p.techStack) ? p.techStack : [],
                        liveUrl: p.liveUrl || "",
                        github: p.github || ""
                    }));
                }

                setData(parsed);
                toast.info("Resume data restored.");
            } catch (e) {
                console.error("Failed to parse saved resume data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save data & Calc Score
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setAts(calculateATSScore(data));
        }
    }, [data, isLoaded]);

    const handleInputChange = (field: keyof ResumeData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleLoadSample = () => {
        setData(sampleData);
        toast.success("Sample data loaded");
    };

    const addItem = <T extends { id: string }>(field: keyof Pick<ResumeData, 'education' | 'experience' | 'projects'>, item: T) => {
        setData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    };

    const removeItem = (field: keyof Pick<ResumeData, 'education' | 'experience' | 'projects'>, id: string) => {
        setData(prev => ({ ...prev, [field]: prev[field].filter(i => i.id !== id) }));
    };

    const handleSuggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            const suggestions = {
                technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
                soft: ["Team Leadership", "Problem Solving"],
                tools: ["Git", "Docker", "AWS"]
            };

            setData(prev => {
                const newSkills = { ...prev.skills };
                suggestions.technical.forEach(s => !newSkills.technical.includes(s) && newSkills.technical.push(s));
                suggestions.soft.forEach(s => !newSkills.soft.includes(s) && newSkills.soft.push(s));
                suggestions.tools.forEach(s => !newSkills.tools.includes(s) && newSkills.tools.push(s));
                return { ...prev, skills: newSkills };
            });

            setIsSuggestingSkills(false);
            toast.success("Skills suggestions added!");
        }, 1000);
    };

    const updateSkillCategory = (category: keyof ResumeData['skills'], newTags: string[]) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: newTags
            }
        }));
    };

    const getBulletGuidance = (text: string) => {
        const guidance = [];
        if (text.length > 10) {
            if (!ACTION_VERBS.test(text)) guidance.push("Start with a strong action verb (e.g., Built, Led).");
            if (!/\d+|%|k\b|\$|x\b/i.test(text)) guidance.push("Add measurable impact (numbers).");
        }
        return guidance;
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col">
            <ResumeNavbar />

            <main className="flex-1 container max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">

                {/* Left Column: Form */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold">Editor</h2>
                        <Button variant="outline" size="sm" onClick={handleLoadSample}>
                            Load Sample
                        </Button>
                    </div>

                    <Card className="bg-white border-primary/10 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3 border-b bg-stone-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-sm font-bold tracking-wider uppercase text-stone-700">ATS Readiness Score</CardTitle>
                                    <span className={cn(
                                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                                        ats.score >= 80 ? "bg-green-100 text-green-700" : ats.score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                    )}>
                                        v1.1
                                    </span>
                                </div>
                                <span className={cn("text-3xl font-serif font-bold", ats.color)}>{ats.score}</span>
                            </div>
                            <Progress value={ats.score} className="h-2 mt-2" />
                        </CardHeader>
                        <CardContent className="pt-4">
                            {ats.suggestions.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                                        <Lightbulb className="h-4 w-4 text-amber-500" />
                                        Top Improvements
                                    </div>
                                    {ats.suggestions.slice(0, 3).map((improvement, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-2 rounded border border-stone-100">
                                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-stone-400 shrink-0" />
                                            <span>{improvement}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 p-3 rounded border border-green-100">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Excellent! Your resume is ready for review.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <ScrollArea className="h-[calc(100vh-380px)] pr-4">
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
                                    <p className="text-xs text-muted-foreground mt-2 text-right">
                                        {data.summary.trim().split(/\s+/).filter(w => w.length > 0).length} words
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Categorized Skills */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Skills</CardTitle>
                                    <Button variant="outline" size="sm" onClick={handleSuggestSkills} disabled={isSuggestingSkills}>
                                        {isSuggestingSkills ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                        Suggest Skills
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Technical Skills ({data.skills.technical?.length || 0})</label>
                                        <TagInput
                                            tags={data.skills.technical || []}
                                            onTagsChange={(tags) => updateSkillCategory('technical', tags)}
                                            placeholder="React, generic..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tools & Technologies ({data.skills.tools?.length || 0})</label>
                                        <TagInput
                                            tags={data.skills.tools || []}
                                            onTagsChange={(tags) => updateSkillCategory('tools', tags)}
                                            placeholder="Git, Docker..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Soft Skills ({data.skills.soft?.length || 0})</label>
                                        <TagInput
                                            tags={data.skills.soft || []}
                                            onTagsChange={(tags) => updateSkillCategory('soft', tags)}
                                            placeholder="Leadership, Communication..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Projects */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Projects</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => addItem('projects', { id: Date.now().toString(), name: 'New Project', description: '', techStack: [], liveUrl: '', github: '', link: '' })}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {data.projects.map(proj => (
                                            <AccordionItem key={proj.id} value={proj.id} className="border rounded-md px-4">
                                                <div className="flex items-center justify-between py-2">
                                                    <AccordionTrigger className="hover:no-underline py-2">
                                                        <span className="font-semibold">{proj.name || "Untitled Project"}</span>
                                                    </AccordionTrigger>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); removeItem('projects', proj.id); }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <AccordionContent className="space-y-4 pt-2 pb-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Project Details</label>
                                                        <Input
                                                            value={proj.name}
                                                            onChange={e => {
                                                                const newProjs = data.projects.map(p => p.id === proj.id ? { ...p, name: e.target.value } : p);
                                                                setData({ ...data, projects: newProjs });
                                                            }}
                                                            placeholder="Project Name"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Links</label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Input
                                                                value={proj.liveUrl}
                                                                onChange={e => {
                                                                    const newProjs = data.projects.map(p => p.id === proj.id ? { ...p, liveUrl: e.target.value } : p);
                                                                    setData({ ...data, projects: newProjs });
                                                                }}
                                                                placeholder="Live URL"
                                                            />
                                                            <Input
                                                                value={proj.github}
                                                                onChange={e => {
                                                                    const newProjs = data.projects.map(p => p.id === proj.id ? { ...p, github: e.target.value } : p);
                                                                    setData({ ...data, projects: newProjs });
                                                                }}
                                                                placeholder="GitHub URL"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Tech Stack</label>
                                                        <TagInput
                                                            tags={proj.techStack || []}
                                                            onTagsChange={(tags) => {
                                                                const newProjs = data.projects.map(p => p.id === proj.id ? { ...p, techStack: tags } : p);
                                                                setData({ ...data, projects: newProjs });
                                                            }}
                                                            placeholder="Next.js, Tailwind..."
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                                                            <span className={cn("text-xs", proj.description.length > 200 ? "text-destructive" : "text-muted-foreground")}>
                                                                {proj.description.length}/200
                                                            </span>
                                                        </div>
                                                        <Textarea
                                                            value={proj.description}
                                                            onChange={e => {
                                                                const newProjs = data.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p);
                                                                setData({ ...data, projects: newProjs });
                                                            }}
                                                            placeholder="Project details..."
                                                            className="min-h-[100px]"
                                                        />
                                                        {getBulletGuidance(proj.description).map((msg, i) => (
                                                            <p key={i} className="text-xs text-amber-600 flex items-center gap-1">
                                                                <Sparkles className="h-3 w-3" /> {msg}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
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
                                            <div className="space-y-1">
                                                <Textarea value={exp.description} onChange={e => {
                                                    const newExp = data.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                                                    setData({ ...data, experience: newExp });
                                                }} placeholder="Description" />
                                                {getBulletGuidance(exp.description).map((msg, i) => (
                                                    <p key={i} className="text-xs text-amber-600 flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" /> {msg}
                                                    </p>
                                                ))}
                                            </div>
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
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-bold">Live Preview</h2>

                            <Button size="sm" variant="default" className="shadow-sm" onClick={() => toast.success("PDF export ready! Check your downloads.")}>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                        </div>
                        {/* Visual Customization Panel */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                            {/* Template Picker */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">Layout Template</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['classic', 'modern', 'minimal'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setData(prev => ({ ...prev, selectedTemplate: t }))}
                                            className={cn(
                                                "relative h-20 rounded-md border-2 transition-all hover:border-primary/50 flex flex-col items-center justify-center gap-1",
                                                data.selectedTemplate === t ? "border-blue-600 bg-blue-50/50" : "border-transparent bg-slate-50"
                                            )}
                                        >
                                            {/* Thumbnail Mockups */}
                                            {t === 'classic' && <div className="w-8 h-10 border border-slate-300 bg-white shadow-sm flex flex-col items-center gap-0.5 p-0.5"><div className="w-full h-1 bg-slate-300 mb-0.5"></div><div className="w-full h-full space-y-0.5"><div className="w-full h-0.5 bg-slate-100"></div><div className="w-full h-0.5 bg-slate-100"></div></div></div>}
                                            {t === 'modern' && <div className="w-8 h-10 border border-slate-300 bg-white shadow-sm flex"><div className="w-1/3 h-full bg-slate-800"></div><div className="w-2/3 h-full p-0.5 space-y-0.5"><div className="w-full h-1 bg-slate-300"></div><div className="w-full h-0.5 bg-slate-100"></div></div></div>}
                                            {t === 'minimal' && <div className="w-8 h-10 border border-slate-300 bg-white shadow-sm p-1 flex flex-col gap-0.5"><div className="w-1/2 h-1 bg-slate-400"></div><div className="w-full h-0.5 bg-slate-100"></div><div className="w-full h-0.5 bg-slate-100"></div></div>}

                                            <span className="text-[10px] font-medium capitalize text-slate-600">{t}</span>

                                            {data.selectedTemplate === t && (
                                                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 className="w-2 h-2 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">Theme Color</label>
                                <div className="flex gap-3">
                                    {THEME_COLORS.map(c => (
                                        <TooltipProvider key={c.name}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => setData(prev => ({ ...prev, themeColor: c.value }))}
                                                        className={cn(
                                                            "w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                                                            c.bg,
                                                            data.themeColor === c.value && "ring-2 ring-offset-2 ring-primary scale-110"
                                                        )}
                                                        aria-label={`Select ${c.name} theme`}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{c.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border shadow-inner">
                        <ScrollArea className="h-full w-full p-8 flex justify-center">
                            <div className="origin-top scale-[0.65] lg:scale-[0.8] xl:scale-90 transition-transform">
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
