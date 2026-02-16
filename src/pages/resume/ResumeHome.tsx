
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, CheckCircle, Sparkles } from "lucide-react";

const ResumeHome = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                <div className="max-w-3xl space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                            <Sparkles className="mr-1 h-3 w-3" />
                            New Feature
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-balance text-foreground">
                            Build a Resume <br />
                            <span className="text-primary">That Gets Read.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Create a professional, ATS-friendly resume in minutes.
                            Clean design, premium typography, and expert structure.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2" asChild>
                            <Link to="/builder">
                                Start Building
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                            <Link to="/preview">
                                View Examples
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                        <div className="flex flex-col gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Clean Layouts</h3>
                            <p className="text-sm text-muted-foreground">Minimalist designs that recruiters love and ATS systems can parse easily.</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Expert Structure</h3>
                            <p className="text-sm text-muted-foreground">Guided sections ensures you don't miss critical information.</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Premium Typography</h3>
                            <p className="text-sm text-muted-foreground">Uses high-quality serif fonts for a distinguished, professional look.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
                <p>© 2026 AI Resume Builder. Built with KodNest Premium System.</p>
            </footer>
        </div>
    );
};

export default ResumeHome;
