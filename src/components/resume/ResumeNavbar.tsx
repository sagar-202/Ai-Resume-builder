
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const ResumeNavbar = () => {
    const { pathname } = useLocation();

    const navItems = [
        { label: "Builder", path: "/builder" },
        { label: "Preview", path: "/preview" },
        { label: "Proof", path: "/rb/proof" },
    ];

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-serif font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                    AI Resume Builder
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.path
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Placeholder for future auth/profile */}
            </div>
        </nav>
    );
};

export default ResumeNavbar;
