
export interface RBStep {
    id: string;
    route: string;
    title: string;
    description: string;
    stepNumber: number;
}

export const RB_STEPS: RBStep[] = [
    {
        id: "problem",
        route: "/rb/01-problem",
        title: "Problem Statement",
        description: "Define the problem you are solving with the AI Resume Builder.",
        stepNumber: 1
    },
    {
        id: "market",
        route: "/rb/02-market",
        title: "Market Analysis",
        description: "Analyze the market landscape and competitors.",
        stepNumber: 2
    },
    {
        id: "architecture",
        route: "/rb/03-architecture",
        title: "System Architecture",
        description: "Design the high-level system architecture.",
        stepNumber: 3
    },
    {
        id: "hld",
        route: "/rb/04-hld",
        title: "High Level Design",
        description: "Detail the high-level design components.",
        stepNumber: 4
    },
    {
        id: "lld",
        route: "/rb/05-lld",
        title: "Low Level Design",
        description: "Specify the low-level design and data models.",
        stepNumber: 5
    },
    {
        id: "build",
        route: "/rb/06-build",
        title: "Implementation",
        description: "Start building the core features.",
        stepNumber: 6
    },
    {
        id: "test",
        route: "/rb/07-test",
        title: "Testing",
        description: "Test the application thoroughly.",
        stepNumber: 7
    },
    {
        id: "ship",
        route: "/rb/08-ship",
        title: "Ship & Deploy",
        description: "Prepare for deployment and final release.",
        stepNumber: 8
    }
];

export const TOTAL_STEPS = RB_STEPS.length;
