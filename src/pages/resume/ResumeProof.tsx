
import ResumeNavbar from "@/components/resume/ResumeNavbar";

const ResumeProof = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ResumeNavbar />

            <main className="flex-1 container max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Proof of Work</h1>
                <p className="text-muted-foreground mb-8">
                    This page will track your progress and artifacts for the AI Resume Builder project.
                </p>

                <div className="w-full max-w-lg p-8 border border-dashed rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Artifacts Placeholder</span>
                </div>
            </main>
        </div>
    );
};

export default ResumeProof;
