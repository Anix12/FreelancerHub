const sampleWorks = [
    {
        title: "Website Development Project",
        profile_image: {
            url:  "/images/profile_pic.jpg",
            filename: "project-image.jpg",
        },
        description: "r an e-commerce business",
        budget: {
            currency: "USD",
            min: 1000,
            max: 5000,
        },
        postedby: "John Doe",
        deadline: new Date("2025-02-15"),
        skillsrequired: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    },
    {
        title: "Mobile App Design",
        profile_image: {
            url: "/images/profile_pic.jpg",
            filename: "app-design.jpg",
        },
        description: "Design a sleek and user-friendly interface for a fitness tracking app.Design a sleek and user-friendly interface for a fitness tracking app.Design a sleek and user-friendly interface for a fitness tracking app.",
        budget: {
            currency: "EUR",
            min: 800,
            max: 2000,
        },
        postedby: "Jane Smith",
        deadline: new Date("2025-03-01"),
        skillsrequired: ["UI/UX Design", "Figma", "Sketch", "Adobe XD"],
    },
    {
        title: "SEO Optimization",
        profile_image: "/images/profile_pic.jpg",
        description: "Optimize website content and structure for search engines.",
        budget: {
            currency: "GBP",
            min: 500,
            max: 1500,
        },
        postedby: "Alice Johnson",
        deadline: new Date("2025-01-31"),
        skillsrequired: ["SEO", "Content Writing", "Analytics"],
    },
];

module.exports = sampleWorks;
