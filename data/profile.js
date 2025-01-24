const sampleData = [
    {
      name: "John Doe",
      image: {
        url: "https://via.placeholder.com/150",
        filename: "john_doe.jpg",
      },
      email: "john.doe@example.com",
      phone: 1234567890,
      skills: ["JavaScript", "Node.js", "React"],
      portfolio: ["64a7f22c91892d0001234567", "64a7f22c91892d0001234568"],
      experience: ["64a7f22c91892d0001234569", "64a7f22c91892d0001234570"],
      certification: ["64a7f22c91892d0001234571"],
    },
    {
      name: "Jane Smith",
      image: {
        url: "https://via.placeholder.com/150",
        filename: "jane_smith.jpg",
      },
      email: "jane.smith@example.com",
      phone: 9876543210,
      skills: ["Python", "Django", "Data Analysis"],
      portfolio: ["64a7f22c91892d0002234567"],
      experience: ["64a7f22c91892d0002234569"],
      certification: ["64a7f22c91892d0002234571", "64a7f22c91892d0002234572"],
    },
    {
      name: "Alice Johnson",
      image: {
        url:  "/assets/profile_pic.jpg",
        filename: "alice_johnson.jpg",
      },
      email: "alice.johnson@example.com",
      phone: null, // No phone provided
      skills: ["Java", "Spring Boot", "Kubernetes"],
      portfolio: [],
      experience: ["64a7f22c91892d0003234569"],
      certification: [],
    },
  ];

  module.exports = sampleData;