
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Copy, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { RB_STEPS } from "@/lib/rb-steps";
import { STORAGE_KEY as CHECKLIST_KEY, isChecklistComplete } from "@/lib/checklist-logic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RBProofPage = () => {
    const [stepStatuses, setStepStatuses] = useState<boolean[]>(new Array(8).fill(false));
    const [checklistPassed, setChecklistPassed] = useState(false);
    const [links, setLinks] = useState({
        lovable: "",
        github: "",
        deploy: ""
    });

    useEffect(() => {
        // 1. Verify Steps
        const statuses = RB_STEPS.map(step => {
            const key = `rb_step_${step.stepNumber}_artifact`;
            const artifact = localStorage.getItem(key);
            return !!artifact;
        });
        setStepStatuses(statuses);

        // 2. Verify Checklist
        const savedChecklist = localStorage.getItem(CHECKLIST_KEY);
        if (savedChecklist) {
            const parsed = JSON.parse(savedChecklist);
            setChecklistPassed(isChecklistComplete(parsed));
        }

        // 3. Load Links
        const savedLinks = localStorage.getItem("rb_final_submission");
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }
    }, []);

    const handleLinkChange = (field: keyof typeof links, value: string) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);
        localStorage.setItem("rb_final_submission", JSON.stringify(newLinks));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const allStepsComplete = stepStatuses.every(Boolean);
    const linksComplete = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
    const isShipped = allStepsComplete && checklistPassed && linksComplete;

    const handleCopySubmission = () => {
        if (!allStepsComplete) {
            toast.error("Please complete all 8 steps first.");
            return;
        }
        if (!checklistPassed) {
            toast.error("Please complete the 10-item checklist.");
            return;
        }
        if (!linksComplete) {
            toast.error("Please provide valid URLs for all 3 links.");
            return;
        }

        const submissionText = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
        `.trim();

        navigator.clipboard.writeText(submissionText);
        toast.success("Final submission copied to clipboard!");
    };

    return (
        <Layout
            projectName="AI Resume Builder"
            currentStep={8}
            totalSteps={8}
            status={isShipped ? "Shipped" : "In Progress"}
            title="Proof of Work"
            description="Verify your progress and submit your final build."
            stepLabel="Final Step"
        >
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => window.history.back()} className="-ml-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>

                {/* Shipped Banner */}
                {isShipped && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-lg font-semibold ml-2">Project 3 Shipped Successfully.</AlertTitle>
                        <AlertDescription className="ml-2 mt-1 text-green-700">
                            Excellent work. You have verified all features and requirements.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* A) Step Completion Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Step Status (8/8)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {RB_STEPS.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex items-center justify-between p-2 rounded-md border text-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => {
                                        const key = `rb_step_${step.stepNumber}_artifact`;
                                        const current = localStorage.getItem(key);
                                        if (current) {
                                            localStorage.removeItem(key);
                                        } else {
                                            localStorage.setItem(key, "Manual Verification Override");
                                        }
                                        // Refresh state
                                        const newStatuses = [...stepStatuses];
                                        newStatuses[index] = !current;
                                        setStepStatuses(newStatuses);
                                    }}
                                >
                                    <span className="font-medium text-slate-700">
                                        {step.stepNumber}. {step.title}
                                    </span>
                                    {stepStatuses[index] ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-slate-200" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Checklist & Links */}
                    <div className="space-y-6">
                        {/* Checklist Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quality Assurance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <span className="font-medium">10-Point Checklist</span>
                                    {checklistPassed ? (
                                        <div className="flex items-center text-green-600 gap-2 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle className="h-4 w-4" /> Passed
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-amber-600 gap-2 text-sm font-bold bg-amber-50 px-3 py-1 rounded-full">
                                            <AlertCircle className="h-4 w-4" /> Pending
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Artifact Collection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Final Artifacts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Lovable Project Link</label>
                                    <Input
                                        placeholder="https://lovable.dev/..."
                                        value={links.lovable}
                                        onChange={(e) => handleLinkChange("lovable", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">GitHub Repository</label>
                                    <Input
                                        placeholder="https://github.com/..."
                                        value={links.github}
                                        onChange={(e) => handleLinkChange("github", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Live Deployment</label>
                                    <Input
                                        placeholder="https://..."
                                        value={links.deploy}
                                        onChange={(e) => handleLinkChange("deploy", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        size="lg"
                        onClick={handleCopySubmission}
                        className="w-full md:w-auto shadow-md"
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Final Submission
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default RBProofPage;
