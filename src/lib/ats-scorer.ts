
import { ResumeData } from "@/types/resume";

export interface ATSResults {
    score: number;
    level: string;
    color: string;
    suggestions: string[];
}

const ACTION_VERBS = /^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated|Managed|Orchestrated|Spearheaded|Launched|Initiated|Executed|Formulated|Coordinated|Established|Collaborated|Engineered|Architected)/i;

export const calculateATSScore = (data: ResumeData): ATSResults => {
    let score = 0;
    const suggestions: string[] = [];

    // 1. Contact Info (+35 max)
    if (data.fullName.trim()) score += 10;
    else suggestions.push("Add your full name (+10).");

    if (data.email.trim()) score += 10;
    else suggestions.push("Add a professional email (+10).");

    if (data.phone.trim()) score += 5;
    else suggestions.push("Add a phone number (+5).");

    if (data.linkedin.trim()) score += 5;
    else suggestions.push("Add your LinkedIn profile (+5).");

    if (data.github.trim()) score += 5;
    else suggestions.push("Add your GitHub profile (+5).");

    // 2. Professional Summary (+20 max)
    if (data.summary.length > 50) score += 10;
    else suggestions.push("Expand your summary (> 50 chars) (+10).");

    if (ACTION_VERBS.test(data.summary)) score += 10;
    else suggestions.push("Use action verbs in your summary (+10).");

    // 3. Experience (+15 max)
    const hasExperience = data.experience.length > 0;
    const hasBullets = data.experience.some(exp => exp.description.includes('•') || exp.description.includes('-') || exp.description.split('\n').length > 1);

    if (hasExperience && hasBullets) score += 15;
    else if (!hasExperience) suggestions.push("Add at least one work experience (+15).");
    else suggestions.push("Use bullet points for experience descriptions (+15).");

    // 4. Education (+10 max)
    if (data.education.length > 0) score += 10;
    else suggestions.push("Add education details (+10).");

    // 5. Skills (+10 max)
    const totalSkills = (data.skills.technical?.length || 0) +
        (data.skills.soft?.length || 0) +
        (data.skills.tools?.length || 0);

    if (totalSkills >= 5) score += 10;
    else suggestions.push(`Add more skills (currently ${totalSkills}, need 5+) (+10).`);

    // 6. Projects (+10 max)
    if (data.projects.length >= 1) score += 10;
    else suggestions.push("Add at least one project (+10).");

    // Cap score at 100
    score = Math.min(100, score);

    // Determine Level & Color
    let level = "Needs Work";
    let color = "text-red-600";
    if (score > 40) { level = "Getting There"; color = "text-amber-600"; }
    if (score > 70) { level = "Strong Resume"; color = "text-green-600"; }

    return { score, level, color, suggestions };
};
