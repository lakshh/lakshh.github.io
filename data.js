const BLOG_POSTS = [
    {
        id: 1,
        title: "The GenAI Agent-UI Space",
        date: "2025-12-20",
        tags: ["Agents", "GenAI", "UI", "AI"],
        contentPath: 'posts/post-1.html'
    },
    {
        id: 2,
        title: "Google's 5-Day AI Agents Intensive Course",
        date: "2025-11-15",
        tags: ["Agents", "GenAI", "AI"],
        contentPath: 'posts/post-2.html'
    },
    {
        id: 3,
        title: "The System Mindset",
        date: "2025-10-10",
        tags: ["Leadership", "Org Culture", "Mindset"],
        contentPath: 'posts/post-3.html'
    },
    {
        id: 4,
        title: "Null Safety with JSpecify",
        date: "2026-01-05",
        tags: ["Spring Boot", "Java", "JSpecify"],
        contentPath: 'posts/jspecify.html'
    },
    {
        id: 5,
        title: "Software Operations Checklist",
        date: "2026-01-12",
        tags: ["Operations", "DevOps", "Process"],
        contentPath: 'posts/operational-audits.html'
    },
    {
        id: 6,
        title: "Writing Effective Self-Appraisals",
        date: "2026-01-19",
        tags: ["Career", "Professional Growth"],
        contentPath: 'posts/self-appraisal.html'
    },
    {
        id: 7,
        title: "Software Essentials",
        date: "2026-02-02",
        tags: ["Software Engineering"],
        contentPath: 'posts/sw-essentials.html'
    }
].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
