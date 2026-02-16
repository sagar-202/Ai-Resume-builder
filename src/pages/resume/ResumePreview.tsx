
import { useState, useEffect } from "react";
import ResumeNavbar from "@/components/resume/ResumeNavbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Copy, Check, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ResumeData, initialData } from "@/types/resume";
import ResumePreviewView from "@/components/resume/ResumePreviewView";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateATSScore, ATSResults } from "@/lib/ats-scorer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "resumeBuilderData";

const ResumePreview = () => {
    const [data, setData] = useState<ResumeData>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ats, setAts] = useState<ATSResults>({ score: 0, level: "Needs Work", color: "text-red-500", suggestions: [] });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (!parsed.selectedTemplate) parsed.selectedTemplate = 'modern';

                // Ensure skills migration
                if (typeof parsed.skills === 'string') {
                    parsed.skills = { technical: [parsed.skills], soft: [], tools: [] };
                }

                setData(parsed);
                setAts(calculateATSScore(parsed));
            } catch (e) {
                console.error("Failed", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        toast.success("PDF export ready! Check your downloads.", {
            description: "Opening print dialog..."
        });
        setTimeout(() => window.print(), 800);
    };

    const handleCopyText = () => {
        const technicalSkills = data.skills.technical?.join(", ") || "";
        const softSkills = data.skills.soft?.join(", ") || "";
        const tools = data.skills.tools?.join(", ") || "";

        const text = `
${data.fullName.toUpperCase()}
${data.email} | ${data.phone} | ${data.location}
${data.linkedin} | ${data.github}

SUMMARY
${data.summary}

SKILLS
${technicalSkills ? `Technical: ${technicalSkills}` : ""}
${tools ? `Tools: ${tools}` : ""}
${softSkills ? `Soft Skills: ${softSkills}` : ""}

EXPERIENCE
${data.experience.map(e => `${e.role} at ${e.company} (${e.duration})\n${e.description}`).join('\n\n')}

PROJECTS
${data.projects.map(p => {
            const links = [p.liveUrl, p.github].filter(Boolean).join(" | ");
            const stack = p.techStack?.join(", ");
            return `${p.name} ${links ? `(${links})` : ""}\nTech: ${stack}\n${p.description}`;
        }).join('\n\n')}

EDUCATION
${data.education.map(e => `${e.school} - ${e.degree} (${e.year})`).join('\n')}
        `.trim();

        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Resume copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isLoaded) return <div className="min-h-screen bg-muted/30" />;

    // Circular Progress CSS
    const circumference = 2 * Math.PI * 45; // radius 45
    const dashoffset = circumference - (ats.score / 100) * circumference;

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col print:bg-white print:min-h-0">
            <div className="print:hidden">
                <ResumeNavbar />
            </div>

            <main className="flex-1 container max-w-7xl mx-auto py-8 px-4 print:p-0 print:max-w-none flex flex-col lg:flex-row gap-8">

                {/* LEFT COLUMN: Controls & ATS Score (Preview Mode) */}
                <div className="w-full lg:w-1/3 space-y-6 print:hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <Button variant="ghost" asChild className="-ml-2">
                            <Link to="/builder">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Editor
                            </Link>
                        </Button>
                    </div>

                    {/* ACTIONS CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h3 className="font-bold text-lg">Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" onClick={handleCopyText} className="w-full justify-start">
                                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                Copy as Text
                            </Button>
                            <Button onClick={handleDownload} className="w-full justify-start">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </div>

                    {/* ATS SCORE CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                ATS Score
                            </h3>
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-full bg-slate-100", ats.color)}>
                                {ats.level}
                            </span>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                <circle
                                    cx="80" cy="80" r="45" fill="none"
                                    stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                                    className={cn("transition-all duration-1000 ease-out", ats.color)}
                                    style={{ strokeDasharray: circumference, strokeDashoffset: dashoffset }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn("text-4xl font-bold", ats.color)}>{ats.score}</span>
                                <span className="text-xs text-muted-foreground uppercase">Score</span>
                            </div>
                        </div>

                        {/* Suggestions */}
                        {ats.suggestions.length > 0 ? (
                            <div className="space-y-3 pt-2 border-t">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Improvements</h4>
                                <ul className="space-y-2">
                                    {ats.suggestions.map((s, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                <p className="text-sm font-medium text-green-800">🎉 Perfect Score! Your resume is ready.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Resume Preview */}
                <div className="w-full lg:w-2/3">
                    <div className="shadow-2xl print:shadow-none bg-white">
                        <ResumePreviewView data={data} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumePreview;
