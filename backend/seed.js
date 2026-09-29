const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const AlumniProfile = require('./models/AlumniProfile');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Review = require('./models/Review');
const InterviewExperience = require('./models/InterviewExperience');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany();
    await StudentProfile.deleteMany();
    await RecruiterProfile.deleteMany();
    await AlumniProfile.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Review.deleteMany();
    await InterviewExperience.deleteMany();
    await Notification.deleteMany();

    console.log('Cleared existing database records.');

    const admin = await User.create({
      name: 'Campus Placement Admin',
      email: 'admin@hireconnect.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@hireconnect.com',
      password: 'student123',
      role: 'student',
      isVerified: true
    });

    const recruiter = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@hireconnect.com',
      password: 'recruiter123',
      role: 'recruiter',
      isVerified: true
    });

    const alumni = await User.create({
      name: 'David Chen',
      email: 'alumni@hireconnect.com',
      password: 'alumni123',
      role: 'alumni',
      isVerified: true
    });

    await StudentProfile.create({
      user: student._id,
      phone: '+1 (555) 234-5678',
      headline: 'Final Year CS Student | Full-Stack Web Developer & DSA Enthusiast',
      bio: 'Passionate computer science student specializing in MERN stack development, API design, and distributed algorithms.',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Data Structures', 'Git'],
      education: [{
        institution: 'Institute of Technology & Science',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: 2022,
        endYear: 2026,
        grade: '3.9 GPA / 9.2 CGPA'
      }],
      experience: [{
        title: 'Full Stack Development Intern',
        company: 'Innovate Labs',
        location: 'Remote',
        startDate: 'May 2025',
        endDate: 'Aug 2025',
        current: false,
        description: 'Built REST APIs and frontend dashboards for automated analytics pipeline.'
      }],
      projects: [{
        title: 'Campus Placement Hub',
        description: 'Full stack recruitment platform with automated job matching and real-time chat.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        link: 'https://github.com/example/campus-hub',
        githubLink: 'https://github.com/example/campus-hub'
      }],
      certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Certified Developer'],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      githubUrl: 'https://github.com/alexjohnson-dev',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson-demo',
      isPremium: true
    });

    const googleCompany = await Company.create({
      name: 'Google Tech',
      logo: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/google/google.png',
      website: 'https://careers.google.com',
      description: 'Global tech leader pioneering search, cloud computing, and Artificial Intelligence.',
      industry: 'Internet & Cloud Services',
      location: 'Mountain View, CA',
      size: '10,000+',
      isVerified: true,
      createdBy: recruiter._id
    });

    const amazonCompany = await Company.create({
      name: 'Amazon Web Services',
      logo: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/aws/aws.png',
      website: 'https://amazon.jobs',
      description: 'World leading cloud infrastructure provider and e-commerce platform.',
      industry: 'Cloud Infrastructure & E-Commerce',
      location: 'Seattle, WA',
      size: '10,000+',
      isVerified: true,
      createdBy: recruiter._id
    });

    await RecruiterProfile.create({
      user: recruiter._id,
      companyName: 'Google Tech',
      companyId: googleCompany._id,
      designation: 'Senior Technical Recruiter',
      phone: '+1 (555) 987-6543',
      linkedinUrl: 'https://linkedin.com/in/sarah-jenkins-recruiter'
    });

    await AlumniProfile.create({
      user: alumni._id,
      currentCompany: 'Amazon Web Services',
      currentDesignation: 'Senior Software Engineer (L5)',
      graduationYear: 2022,
      department: 'Computer Science & Engineering',
      industry: 'Cloud Infrastructure',
      location: 'Seattle, WA',
      skills: ['Distributed Systems', 'Java', 'AWS Lambda', 'DynamoDB', 'System Design'],
      bio: 'Alumnus from 2022 Batch. Happy to guide juniors with interview prep and internal AWS referrals.',
      linkedinUrl: 'https://linkedin.com/in/davidchen-alumni',
      isAvailableForMentorship: true,
      isAvailableForReferrals: true
    });

    const job1 = await Job.create({
      title: 'Software Development Engineer - Campus 2026',
      company: googleCompany._id,
      companyName: 'Google Tech',
      description: 'We are hiring entry-level Software Engineers for core infrastructure, search, and frontend applications. Work with cutting edge web technology and high concurrency databases.',
      location: 'Mountain View, CA / Hybrid',
      employmentType: 'Full-Time',
      experienceRequired: '0-1 years (New Grads)',
      salary: '$135,000 - $160,000 / year + RSUs',
      skills: ['JavaScript', 'React', 'Node.js', 'Data Structures', 'Algorithms'],
      eligibility: 'B.Tech / M.Tech in CS or related technical degree',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      postedBy: recruiter._id,
      status: 'Open',
      applicantsCount: 1
    });

    const job2 = await Job.create({
      title: 'Cloud Solutions Associate Engineer',
      company: amazonCompany._id,
      companyName: 'Amazon Web Services',
      description: 'Join the AWS cloud technical team. Assist Enterprise clients in migrating legacy applications to resilient serverless microservices.',
      location: 'Seattle, WA / Remote',
      employmentType: 'Full-Time',
      experienceRequired: '0-2 years',
      salary: '$120,000 - $145,000 / year',
      skills: ['Python', 'Java', 'AWS', 'Linux', 'Networking'],
      eligibility: 'Graduation Year 2025 or 2026',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      postedBy: recruiter._id,
      status: 'Open',
      applicantsCount: 0
    });

    await Application.create({
      student: student._id,
      job: job1._id,
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverLetter: 'I am highly passionate about full stack web development and building high speed web applications.',
      status: 'Shortlisted',
      recruiterNotes: 'Strong React & Node skills. Invited for technical Round 1.'
    });

    await Review.create({
      author: alumni._id,
      companyName: 'Amazon Web Services',
      overallRating: 5,
      workLifeBalance: 4,
      workEnvironment: 5,
      careerGrowth: 5,
      reviewText: 'Great learning trajectory for freshers. The engineering standards are world class and mentorship culture is active.',
      isAnonymous: false,
      status: 'Approved'
    });

    await InterviewExperience.create({
      author: alumni._id,
      companyName: 'Google Tech',
      role: 'Software Engineer (Entry Level)',
      difficulty: 'Hard',
      outcome: 'Selected',
      rounds: [
        { roundName: 'Online Assessment', description: '2 Leetcode medium questions on Array sliding windows and HashMap.' },
        { roundName: 'Technical Round 1', description: 'Binary Tree traversal with edge cases and time complexity optimization.' },
        { roundName: 'Technical Round 2', description: 'System Design for a lightweight URL shortener service with cache layer.' }
      ],
      questions: [
        'How do you optimize an LRU Cache in O(1) time complexity?',
        'Implement a Trie for auto-completion prefixes.',
        'Explain event loop and microtask queue execution in JavaScript.'
      ],
      experienceText: 'Focused heavily on fundamental Data Structures & Algorithms. Explain your thought process out loud to the interviewer.',
      advice: 'Master Leetcode medium topics and revise system design fundamentals.',
      status: 'Approved'
    });

    await Notification.create({
      recipient: student._id,
      title: 'Application Update',
      message: 'Your application for Software Development Engineer - Campus 2026 at Google Tech has been Shortlisted!',
      type: 'application',
      link: '/student/applications'
    });

    console.log('Seed completed successfully!');
    console.log('\nDefault Test Login Accounts:');
    console.log('Admin:     admin@hireconnect.com / admin123');
    console.log('Student:   student@hireconnect.com / student123');
    console.log('Recruiter: recruiter@hireconnect.com / recruiter123');
    console.log('Alumni:    alumni@hireconnect.com / alumni123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
