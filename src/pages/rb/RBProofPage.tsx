
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Copy, ExternalLink, Rocket } from "lucide-react";
import { toast } from "sonner";
import { RB_STEPS } from "@/lib/rb-steps";

const RBProofPage = () => {
    const [stepStatuses, setStepStatuses] = useState<boolean[]>(new Array(8).fill(false));
    const [links, setLinks] = useState({
        lovable: "",
        github: "",
        deploy: ""
    });

    useEffect(() => {
        const statuses = RB_STEPS.map(step => {
            const key = `rb_step_${step.stepNumber}_artifact`;
            const artifact = localStorage.getItem(key);
            return !!artifact;
        });
        setStepStatuses(statuses);

        // Load saved links if any
        const savedLinks = localStorage.getItem("rb_proof_links");
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }
    }, []);

    const handleLinkChange = (field: keyof typeof links, value: string) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);
        localStorage.setItem("rb_proof_links", JSON.stringify(newLinks));
    };

    const handleCopySubmission = () => {
        const allStepsComplete = stepStatuses.every(Boolean);
        if (!allStepsComplete) {
            toast.error("Please complete all 8 steps first.");
            return;
        }
        if (!links.lovable || !links.github || !links.deploy) {
            toast.error("Please provide all 3 links.");
            return;
        }

        const submissionText = `
AI Resume Builder - Build Track Submission

Step Status:
${RB_STEPS.map((s, i) => `${s.stepNumber}. ${s.title}: ${stepStatuses[i] ? "✅" : "❌"}`).join("\n")}

Links:
- Lovable: ${links.lovable}
- GitHub: ${links.github}
- Deploy: ${links.deploy}
        `.trim();

        navigator.clipboard.writeText(submissionText);
        toast.success("Submission copied to clipboard!");
    };

    const allStepsComplete = stepStatuses.every(Boolean);

    return (
        <Layout
            projectName="AI Resume Builder"
            currentStep={9}
            totalSteps={8}
            status={allStepsComplete ? "Shipped" : "In Progress"}
            title="Proof of Work"
            description="Verify your progress and submit your final build."
            stepLabel="Final Step"
        >
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Step Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {RB_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <span className="font-medium text-sm">
                                    {step.stepNumber}. {step.title}
                                </span>
                                {stepStatuses[index] ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-300" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lovable Project Link</label>
                            <Input
                                placeholder="https://lovable.dev/..."
                                value={links.lovable}
                                onChange={(e) => handleLinkChange("lovable", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub Repository Link</label>
                            <Input
                                placeholder="https://github.com/..."
                                value={links.github}
                                onChange={(e) => handleLinkChange("github", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deployed URL</label>
                            <Input
                                placeholder="https://..."
                                value={links.deploy}
                                onChange={(e) => handleLinkChange("deploy", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        onClick={handleCopySubmission}
                        className="w-full md:w-auto"
                        disabled={!allStepsComplete}
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
