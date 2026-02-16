
import ResumeNavbar from "@/components/resume/ResumeNavbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

const ResumePreview = () => {
    // In a real app, this would consume context or state.
    // For skeleton, we'll confirm layout structure.

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col">
            <ResumeNavbar />

            <main className="flex-1 container max-w-4xl mx-auto py-12 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link to="/builder">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Editor
                        </Link>
                    </Button>
                    <div className="flex gap-4">
                        <Button variant="outline">
                            Change Template
                        </Button>
                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                <div className="bg-white text-black p-12 shadow-lg min-h-[1123px] w-full font-serif mx-auto">
                    {/* Mock Content for Preview Route */}
                    <div className="text-center border-b-2 border-black pb-8 mb-8">
                        <h1 className="text-5xl font-bold uppercase tracking-wide mb-4">Alex Morgan</h1>
                        <div className="flex justify-center flex-wrap gap-4 text-sm font-sans text-gray-600">
                            <span>alex.morgan@example.com</span>
                            <span>• +1 (555) 123-4567</span>
                            <span>• San Francisco, CA</span>
                        </div>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Professional Summary</h2>
                        <p className="leading-relaxed text-gray-800">
                            Experienced Full Stack Developer with a passion for building scalable web applications.
                            Proven track record in delivering high-quality code and leading agile teams.
                            Adept at cloud architecture and modern frontend frameworks.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Experience</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between font-bold">
                                    <span className="text-lg">Senior Developer</span>
                                    <span>2022 - Present</span>
                                </div>
                                <div className="font-semibold text-gray-700 mb-2">Tech Solutions Inc.</div>
                                <p className="text-gray-800">
                                    Led development of core platform features. Improved performance by 40%.
                                    Mentored junior developers and implemented CI/CD pipelines.
                                </p>
                            </div>
                        </div>
                    </section>
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 mt-12 bg-gray-50/50">
                        <p>Preview Mode - Content flows from Builder</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumePreview;
