
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Copy, ExternalLink, ArrowRight, Upload } from "lucide-react";
import { toast } from "sonner";
import { RB_STEPS } from "@/lib/rb-steps";

const RBStepPage = () => {
    const { stepId } = useParams(); // Start with stepId?
    // Actually routes are explicit: /rb/01-problem etc.
    // I can detect step from path or pass it as prop?
    // Using explicit routes means I need a way to know which step I am on.
    // I will use window.location.pathname or pass a prop if I use explicit route definition.
    // Better to use a lookup from path.

    const navigate = useNavigate();
    const currentPath = window.location.pathname;
    const currentStepConfig = RB_STEPS.find(s => currentPath.endsWith(s.route) || currentPath === s.route) || RB_STEPS[0];

    const stepKey = `rb_step_${currentStepConfig.stepNumber}_artifact`;
    const [artifact, setArtifact] = useState<string>("");
    const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

    useEffect(() => {
        const saved = localStorage.getItem(stepKey);
        if (saved) {
            setArtifact(saved);
            setStatus("success");
        } else {
            setArtifact("");
            setStatus("pending");
        }
    }, [stepKey]);

    const handleCopy = () => {
        const textToCopy = `Build this step: ${currentStepConfig.title}\n\n${currentStepConfig.description}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success("Copied to clipboard!");
    };

    const handleArtifactChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArtifact(e.target.value);
    };

    const saveArtifact = () => {
        if (!artifact.trim()) {
            toast.error("Please enter an artifact or proof.");
            return;
        }
        localStorage.setItem(stepKey, artifact);
        setStatus("success");
        toast.success("Artifact saved!");
    };

    const handleNext = () => {
        const nextStep = RB_STEPS.find(s => s.stepNumber === currentStepConfig.stepNumber + 1);
        if (nextStep) {
            navigate(nextStep.route);
        } else {
            navigate("/rb/proof");
        }
    };

    return (
        <Layout
            projectName="AI Resume Builder"
            currentStep={currentStepConfig.stepNumber}
            totalSteps={8}
            status={status === "success" ? "In Progress" : "Not Started"} // Just rough mapping
            title={currentStepConfig.title}
            description={currentStepConfig.description}
            stepLabel={`Step ${currentStepConfig.stepNumber}`}
            sidebar={
                <div className="space-y-6 pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Build This Step</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prompt</label>
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={`Build this step: ${currentStepConfig.title}\n\n${currentStepConfig.description}`}
                                        className="h-32 pr-10 resize-none font-mono text-xs"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={handleCopy}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button className="w-full gap-2" variant="outline" asChild>
                                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Build in Lovable
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Submit Artifact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Proof of Work</label>
                                <Textarea
                                    placeholder="Paste screenshot URL or description of what worked..."
                                    value={artifact}
                                    onChange={handleArtifactChange}
                                    className="h-32 resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        setArtifact("Analyzed and Verified");
                                        localStorage.setItem(stepKey, "Analyzed and Verified");
                                        setStatus("success");
                                    }}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    It Worked
                                </Button>
                                <Button
                                    onClick={saveArtifact}
                                    className="flex-1"
                                >
                                    Save
                                </Button>
                            </div>

                            {status === "success" && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-2 rounded">
                                    <CheckCircle className="h-4 w-4" />
                                    Step Complete
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            }
        >
            <div className="prose max-w-none">
                {/* Content Placeholder */}
                <div className="p-8 border rounded-lg border-dashed text-center text-muted-foreground bg-muted/20">
                    <h3 className="text-xl font-semibold mb-2">Step Content Area</h3>
                    <p>
                        This is where the detailed instructions and context for
                        <strong> {currentStepConfig.title} </strong>
                        will replace this placeholder.
                    </p>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleNext}
                        disabled={status !== "success" && !artifact}
                    >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default RBStepPage;
