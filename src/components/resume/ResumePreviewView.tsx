
import { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";
import { Github, Globe, Link as LinkIcon, MapPin, Mail, Phone, Linkedin } from "lucide-react";

interface ResumePreviewProps {
    data: ResumeData;
}

const ResumePreviewView = ({ data }: ResumePreviewProps) => {
    const { selectedTemplate, themeColor } = data;

    // Helper to render skills
    const renderSkillCategory = (title: string, skills: string[]) => {
        if (!skills || skills.length === 0) return null;
        return (
            <div className="mb-2">
                <span className="font-semibold mr-2 text-sm" style={{ color: selectedTemplate === 'minimal' ? 'inherit' : themeColor }}>{title}:</span>
                <span className="text-sm">{skills.join(", ")}</span>
            </div>
        );
    };

    // --- MODERN TEMPLATE (2-Column) ---
    if (selectedTemplate === 'modern') {
        return (
            <div className="bg-white text-black min-h-[1056px] shadow-sm print:shadow-none print:min-h-0 flex text-left font-sans" id="resume-preview">
                {/* Left Sidebar */}
                <aside className="w-[32%] text-white p-6 pt-8 print:p-6" style={{ backgroundColor: themeColor, color: 'white' }}>

                    {/* Contact Info (Sidebar) */}
                    <div className="mb-8 space-y-3 text-sm">
                        {data.location && <div className="flex items-center gap-2 opacity-90"><MapPin className="h-4 w-4 shrink-0" /> {data.location}</div>}
                        {data.email && <div className="flex items-center gap-2 opacity-90"><Mail className="h-4 w-4 shrink-0" /> {data.email}</div>}
                        {data.phone && <div className="flex items-center gap-2 opacity-90"><Phone className="h-4 w-4 shrink-0" /> {data.phone}</div>}
                        {data.linkedin && <div className="flex items-center gap-2 opacity-90"><Linkedin className="h-4 w-4 shrink-0" /> {data.linkedin.replace(/^https?:\/\//, '')}</div>}
                        {data.github && <div className="flex items-center gap-2 opacity-90"><Github className="h-4 w-4 shrink-0" /> {data.github.replace(/^https?:\/\//, '')}</div>}
                    </div>

                    {/* Education (Sidebar) */}
                    {data.education.length > 0 && (
                        <div className="mb-8">
                            <h3 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-70 border-b border-white/20 pb-1">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold">{edu.school}</div>
                                        <div className="text-sm opacity-90">{edu.degree}</div>
                                        <div className="text-xs opacity-70 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills (Sidebar) */}
                    <div className="mb-8">
                        <h3 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-70 border-b border-white/20 pb-1">Skills</h3>
                        <div className="space-y-4 text-sm">
                            {(data.skills.technical?.length > 0) && (
                                <div>
                                    <div className="font-semibold opacity-90 mb-1">Technical</div>
                                    <div className="opacity-80 leading-relaxed">{data.skills.technical.join(", ")}</div>
                                </div>
                            )}
                            {(data.skills.tools?.length > 0) && (
                                <div>
                                    <div className="font-semibold opacity-90 mb-1">Tools</div>
                                    <div className="opacity-80 leading-relaxed">{data.skills.tools.join(", ")}</div>
                                </div>
                            )}
                            {(data.skills.soft?.length > 0) && (
                                <div>
                                    <div className="font-semibold opacity-90 mb-1">Soft Skills</div>
                                    <div className="opacity-80 leading-relaxed">{data.skills.soft.join(", ")}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Content */}
                <main className="flex-1 p-8 pt-10">
                    <header className="mb-8">
                        <h1 className="text-5xl font-bold uppercase tracking-tight mb-2" style={{ color: themeColor }}>{data.fullName}</h1>
                        <p className="text-lg text-gray-600">{data.experience[0]?.role || "Professional"}</p>
                    </header>

                    {data.summary && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-3 border-b-2 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Profile</h2>
                            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Experience</h2>
                            <div className="space-y-5">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg">{exp.role}</h3>
                                            <span className="text-sm font-semibold text-gray-500">{exp.duration}</span>
                                        </div>
                                        <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Projects</h2>
                            <div className="space-y-5">
                                {data.projects.map(proj => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-base">{proj.name}</h3>
                                            <div className="flex gap-2 text-xs print:hidden">
                                                {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Live</a>}
                                                {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="text-gray-600 hover:underline">GitHub</a>}
                                            </div>
                                        </div>
                                        <div className="mb-2 flex flex-wrap gap-1">
                                            {proj.techStack?.map(t => (
                                                <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full border border-gray-200">{t}</span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        );
    }

    // --- CLASSIC & MINIMAL TEMPLATES (Single Column) ---
    const isClassic = selectedTemplate === 'classic';
    const isMinimal = selectedTemplate === 'minimal';

    return (
        <div className={cn(
            "bg-white text-black p-10 min-h-[1056px] shadow-sm print:shadow-none print:min-h-0",
            isClassic && "font-serif text-center",
            isMinimal && "font-mono text-left text-sm"
        )} id="resume-preview">

            <header className={cn(
                "border-b-2 pb-6 mb-8",
                isClassic ? "border-double" : "border-none pb-0 mb-8"
            )} style={{ borderColor: isClassic ? themeColor : 'transparent' }}>
                <h1 className={cn(
                    "font-bold uppercase tracking-wide mb-3",
                    isClassic ? "text-4xl" : "text-3xl lowercase"
                )} style={{ color: isClassic ? themeColor : 'black' }}>
                    {data.fullName || "Your Name"}
                </h1>

                <div className={cn(
                    "flex flex-wrap gap-3 text-sm text-gray-600 print:text-black",
                    isClassic && "justify-center italic",
                    isMinimal && "justify-start text-xs"
                )}>
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>• {data.phone}</span>}
                    {data.location && <span>• {data.location}</span>}
                    {data.linkedin && <span>• {data.linkedin}</span>}
                    {data.github && <span>• {data.github}</span>}
                </div>
            </header>

            {data.summary && (
                <section className="mb-6">
                    {/* Unique Minimal Section Title */}
                    {isMinimal ? (
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-400 border-none">Summary</h2>
                    ) : (
                        <h2 className="text-lg font-bold uppercase border-b mb-3 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Summary</h2>
                    )}
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                </section>
            )}

            {/* Combined Skills Section */}
            {(data.skills.technical?.length > 0 || data.skills.soft?.length > 0 || data.skills.tools?.length > 0) && (
                <section className="mb-6">
                    {isMinimal ? (
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-400 border-none">Skills</h2>
                    ) : (
                        <h2 className="text-lg font-bold uppercase border-b mb-3 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Skills</h2>
                    )}
                    <div className={isClassic ? "flex flex-col items-center" : "text-left"}>
                        {renderSkillCategory("Technical", data.skills.technical)}
                        {renderSkillCategory("Tools", data.skills.tools)}
                        {renderSkillCategory("Soft Skills", data.skills.soft)}
                    </div>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    {isMinimal ? (
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-400 border-none">Experience</h2>
                    ) : (
                        <h2 className="text-lg font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Experience</h2>
                    )}
                    <div className="space-y-6">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="break-inside-avoid">
                                <div className={cn("flex justify-between font-bold text-sm mb-1", isMinimal && "font-normal text-base")}>
                                    <span style={{ color: isClassic ? 'black' : 'inherit' }}>{exp.role}</span>
                                    <span className="text-gray-600">{exp.duration}</span>
                                </div>
                                <div className={cn("text-sm font-semibold mb-2", isClassic && "italic")} style={{ color: themeColor }}>{exp.company}</div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects.length > 0 && (
                <section className="mb-6">
                    {isMinimal ? (
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-400 border-none">Projects</h2>
                    ) : (
                        <h2 className="text-lg font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Projects</h2>
                    )}
                    <div className="space-y-5">
                        {data.projects.map(proj => (
                            <div key={proj.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={cn("font-bold text-sm", isMinimal && "font-normal text-base")}>{proj.name}</span>
                                    {/* Links */}
                                    <div className="flex gap-2 text-xs print:hidden">
                                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Live</a>}
                                        {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="text-gray-600 hover:underline">GitHub</a>}
                                    </div>
                                </div>
                                <div className="mb-2 flex flex-wrap gap-1 justify-start">
                                    {proj.techStack?.map(t => (
                                        <span key={t} className={cn("text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full border border-gray-200", isMinimal && "bg-transparent border-black")}>{t}</span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section>
                    {isMinimal ? (
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-400 border-none">Education</h2>
                    ) : (
                        <h2 className="text-lg font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Education</h2>
                    )}
                    <div className="space-y-3">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-sm break-inside-avoid">
                                <div>
                                    <span className="font-bold block">{edu.school}</span>
                                    <span className={cn("text-xs", isClassic && "italic")}>{edu.degree}</span>
                                </div>
                                <span className="font-semibold text-gray-600">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ResumePreviewView;
