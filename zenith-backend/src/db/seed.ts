import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  instructorProfiles,
  studentProfiles,
  skills,
  courses,
  courseChapters,
  articles,
  studentSkills,
  chats,
  messages,
  skillTransfers,
  sessions,
  users,
  UserRole,
  videos,
  enrollments,
} from "../models";
import { CourseStatus } from "../models/course.model";
import { SkillTransferStatus } from "../models/skillTransfer.model";
import { StudentSkillType } from "../models/studentSkill.model";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";
import type { InferModel } from "drizzle-orm";

type User = InferModel<typeof users>;
type SkillTransfer = InferModel<typeof skillTransfers>;
type Session = InferModel<typeof sessions>;

// Create SQLite database connection
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // --- USERS ---
    // Admin
    let [admin] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@zenith.com"));
    if (!admin) {
      const adminPasswordHash = await bcrypt.hash("admin123", 10);
      [admin] = await db
        .insert(users)
        .values({
          email: "admin@zenith.com",
          passwordHash: adminPasswordHash,
          firstName: "Admin",
          lastName: "User",
          username: "admin",
          role: UserRole.ADMIN,
        } as User)
        .returning();
    }

    // Instructor
    let [instructor] = await db
      .select()
      .from(users)
      .where(eq(users.email, "instructor@zenith.com"));
    if (!instructor) {
      const instructorPasswordHash = await bcrypt.hash("instructor123", 10);
      [instructor] = await db
        .insert(users)
        .values({
          email: "instructor@zenith.com",
          passwordHash: instructorPasswordHash,
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          role: UserRole.INSTRUCTOR,
        } as User)
        .returning();
    }

    // Instructor Profile
    let [instructorProfile] = await db
      .select()
      .from(instructorProfiles)
      .where(eq(instructorProfiles.userId, instructor.id));
    if (!instructorProfile) {
      [instructorProfile] = await db
        .insert(instructorProfiles)
        .values({
          userId: instructor.id,
          coursesCount: 3,
        })
        .returning();

      // Update instructor with profile ID
      await db
        .update(users)
        .set({ instructorProfileId: instructorProfile.id })
        .where(eq(users.id, instructor.id));
    }

    // Student
    let [student] = await db
      .select()
      .from(users)
      .where(eq(users.email, "student@zenith.com"));
    if (!student) {
      const studentPasswordHash = await bcrypt.hash("student123", 10);
      [student] = await db
        .insert(users)
        .values({
          email: "student@zenith.com",
          passwordHash: studentPasswordHash,
          firstName: "Jane",
          lastName: "Smith",
          username: "janesmith",
          role: UserRole.STUDENT,
        } as User)
        .returning();
    }

    // Student Profile
    let [studentProfile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, student.id));
    if (!studentProfile) {
      [studentProfile] = await db
        .insert(studentProfiles)
        .values({
          userId: student.id,
          points: 0,
        })
        .returning();

      // Update student with profile ID
      await db
        .update(users)
        .set({ studentProfileId: studentProfile.id })
        .where(eq(users.id, student.id));
    }

    // --- SKILLS ---
    let [programmingSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.title, "Programming"));
    if (!programmingSkill) {
      [programmingSkill] = await db
        .insert(skills)
        .values({ title: "Programming" })
        .returning();
    }
    let [designSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.title, "Design"));
    if (!designSkill) {
      [designSkill] = await db
        .insert(skills)
        .values({ title: "Design" })
        .returning();
    }

    // Add more skills
    let [webDevSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.title, "Web Development"));
    if (!webDevSkill) {
      [webDevSkill] = await db
        .insert(skills)
        .values({ title: "Web Development" })
        .returning();
    }

    let [aiSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.title, "AI & Machine Learning"));
    if (!aiSkill) {
      [aiSkill] = await db
        .insert(skills)
        .values({ title: "AI & Machine Learning" })
        .returning();
    }

    let [dataScienceSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.title, "Data Science"));
    if (!dataScienceSkill) {
      [dataScienceSkill] = await db
        .insert(skills)
        .values({ title: "Data Science" })
        .returning();
    }

    // Second Student (Teacher)
    let [teacherStudent] = await db
      .select()
      .from(users)
      .where(eq(users.email, "teacher.student@zenith.com"));
    if (!teacherStudent) {
      const teacherStudentPasswordHash = await bcrypt.hash("teacher123", 10);
      [teacherStudent] = await db
        .insert(users)
        .values({
          email: "teacher.student@zenith.com",
          passwordHash: teacherStudentPasswordHash,
          firstName: "Alex",
          lastName: "Johnson",
          username: "alexjohnson",
          role: UserRole.STUDENT,
        } as User)
        .returning();
    }

    // Second Student Profile (Teacher)
    let [teacherStudentProfile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, teacherStudent.id));
    if (!teacherStudentProfile) {
      [teacherStudentProfile] = await db
        .insert(studentProfiles)
        .values({
          userId: teacherStudent.id,
          points: 100, // Teacher student starts with some points
        })
        .returning();

      // Update teacher student with profile ID
      await db
        .update(users)
        .set({ studentProfileId: teacherStudentProfile.id })
        .where(eq(users.id, teacherStudent.id));
    }

    // Add learned skills for teacher student
    const teacherProgrammingSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, teacherStudentProfile.id),
          eq(studentSkills.skillId, programmingSkill.id)
        )
      );
    if (teacherProgrammingSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: teacherStudentProfile.id,
        skillId: programmingSkill.id,
        type: StudentSkillType.LEARNED,
        points: 85, // High points for programming expertise
        description: "Expert in multiple programming languages and paradigms",
      });
    }

    const teacherDesignSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, teacherStudentProfile.id),
          eq(studentSkills.skillId, designSkill.id)
        )
      );
    if (teacherDesignSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: teacherStudentProfile.id,
        skillId: designSkill.id,
        type: StudentSkillType.LEARNED,
        points: 75, // Strong design skills
        description: "Proficient in UI/UX and graphic design",
      });
    }

    // Add more learned skills for teacher student
    const teacherWebDevSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, teacherStudentProfile.id),
          eq(studentSkills.skillId, webDevSkill.id)
        )
      );
    if (teacherWebDevSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: teacherStudentProfile.id,
        skillId: webDevSkill.id,
        type: StudentSkillType.LEARNED,
        points: 90, // Expert web development skills
        description: "Full-stack web development with modern frameworks",
      });
    }

    const teacherAiSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, teacherStudentProfile.id),
          eq(studentSkills.skillId, aiSkill.id)
        )
      );
    if (teacherAiSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: teacherStudentProfile.id,
        skillId: aiSkill.id,
        type: StudentSkillType.LEARNED,
        points: 80, // Strong AI/ML knowledge
        description: "Experience with machine learning and AI applications",
      });
    }

    // --- STUDENT SKILL ---
    // Add needed skills for regular student
    const studentProgrammingSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, studentProfile.id),
          eq(studentSkills.skillId, programmingSkill.id)
        )
      );
    if (studentProgrammingSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: studentProfile.id,
        skillId: programmingSkill.id,
        type: StudentSkillType.NEEDED,
      });
    }

    const studentDesignSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, studentProfile.id),
          eq(studentSkills.skillId, designSkill.id)
        )
      );
    if (studentDesignSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: studentProfile.id,
        skillId: designSkill.id,
        type: StudentSkillType.NEEDED,
      });
    }

    const studentWebDevSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, studentProfile.id),
          eq(studentSkills.skillId, webDevSkill.id)
        )
      );
    if (studentWebDevSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: studentProfile.id,
        skillId: webDevSkill.id,
        type: StudentSkillType.NEEDED,
      });
    }

    const studentDataScienceSkill = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, studentProfile.id),
          eq(studentSkills.skillId, dataScienceSkill.id)
        )
      );
    if (studentDataScienceSkill.length === 0) {
      await db.insert(studentSkills).values({
        studentId: studentProfile.id,
        skillId: dataScienceSkill.id,
        type: StudentSkillType.NEEDED,
      });
    }

    // --- COURSE ---
    let [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Introduction to Programming"));
    if (!course) {
      [course] = await db
        .insert(courses)
        .values({
          title: "Introduction to Programming",
          description: "Learn the basics of programming",
          instructorId: instructorProfile.id,
          price: 49.99,
        })
        .returning();
    }

    // Add more courses
    let [webDevCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Modern Web Development"));
    if (!webDevCourse) {
      [webDevCourse] = await db
        .insert(courses)
        .values({
          title: "Modern Web Development",
          description:
            "Master modern web development with React, TypeScript, and Next.js",
          instructorId: instructorProfile.id,
          price: 79.99,
        })
        .returning();
    }

    let [aiCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "AI & Machine Learning Fundamentals"));
    if (!aiCourse) {
      [aiCourse] = await db
        .insert(courses)
        .values({
          title: "AI & Machine Learning Fundamentals",
          description: "Learn the basics of AI and machine learning",
          instructorId: instructorProfile.id,
          price: 99.99,
        })
        .returning();
    }

    // Add more courses with varying price points
    let [dataScienceCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Data Science Essentials"));
    if (!dataScienceCourse) {
      [dataScienceCourse] = await db
        .insert(courses)
        .values({
          title: "Data Science Essentials",
          description:
            "Master data analysis, visualization, and statistical methods",
          instructorId: instructorProfile.id,
          price: 29.99,
        })
        .returning();
    }

    let [mobileDevCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Mobile App Development"));
    if (!mobileDevCourse) {
      [mobileDevCourse] = await db
        .insert(courses)
        .values({
          title: "Mobile App Development",
          description: "Build iOS and Android apps using React Native",
          instructorId: instructorProfile.id,
          price: 69.99,
        })
        .returning();
    }

    let [cybersecurityCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Cybersecurity Fundamentals"));
    if (!cybersecurityCourse) {
      [cybersecurityCourse] = await db
        .insert(courses)
        .values({
          title: "Cybersecurity Fundamentals",
          description:
            "Learn essential security practices and threat prevention",
          instructorId: instructorProfile.id,
          price: 39.99,
        })
        .returning();
    }

    let [cloudComputingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Cloud Computing & DevOps"));
    if (!cloudComputingCourse) {
      [cloudComputingCourse] = await db
        .insert(courses)
        .values({
          title: "Cloud Computing & DevOps",
          description: "Master AWS, Azure, and modern deployment practices",
          instructorId: instructorProfile.id,
          price: 149.99,
        })
        .returning();
    }

    let [gameDevCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.title, "Game Development with Unity"));
    if (!gameDevCourse) {
      [gameDevCourse] = await db
        .insert(courses)
        .values({
          title: "Game Development with Unity",
          description: "Create 2D and 3D games using Unity game engine",
          instructorId: instructorProfile.id,
          price: 89.99,
        })
        .returning();
    }

    // --- CHAPTERS ---
    // Chapters for Introduction to Programming
    let [chapter1] = await db
      .select()
      .from(courseChapters)
      .where(
        and(
          eq(courseChapters.title, "Getting Started"),
          eq(courseChapters.courseId, course.id)
        )
      );
    if (!chapter1) {
      [chapter1] = await db
        .insert(courseChapters)
        .values({
          title: "Getting Started",
          courseId: course.id,
          orderIndex: 1,
        })
        .returning();
    }

    let [chapter2] = await db
      .select()
      .from(courseChapters)
      .where(
        and(
          eq(courseChapters.title, "Variables and Data Types"),
          eq(courseChapters.courseId, course.id)
        )
      );
    if (!chapter2) {
      [chapter2] = await db
        .insert(courseChapters)
        .values({
          title: "Variables and Data Types",
          courseId: course.id,
          orderIndex: 2,
        })
        .returning();
    }

    // Chapters for Web Development
    let [webChapter1] = await db
      .select()
      .from(courseChapters)
      .where(
        and(
          eq(courseChapters.title, "React Fundamentals"),
          eq(courseChapters.courseId, webDevCourse.id)
        )
      );
    if (!webChapter1) {
      [webChapter1] = await db
        .insert(courseChapters)
        .values({
          title: "React Fundamentals",
          courseId: webDevCourse.id,
          orderIndex: 1,
        })
        .returning();
    }

    let [webChapter2] = await db
      .select()
      .from(courseChapters)
      .where(
        and(
          eq(courseChapters.title, "TypeScript Essentials"),
          eq(courseChapters.courseId, webDevCourse.id)
        )
      );
    if (!webChapter2) {
      [webChapter2] = await db
        .insert(courseChapters)
        .values({
          title: "TypeScript Essentials",
          courseId: webDevCourse.id,
          orderIndex: 2,
        })
        .returning();
    }

    // --- ARTICLES ---
    // Articles for Introduction to Programming
    const article1Exists = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.title, "What is Programming?"),
          eq(articles.chapterId, chapter1.id)
        )
      );
    if (article1Exists.length === 0) {
      await db.insert(articles).values({
        title: "What is Programming?",
        content:
          "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
        chapterId: chapter1.id,
      });
    }

    const article2Exists = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.title, "Understanding Variables"),
          eq(articles.chapterId, chapter2.id)
        )
      );
    if (article2Exists.length === 0) {
      await db.insert(articles).values({
        title: "Understanding Variables",
        content:
          "Variables are containers for storing data values. In programming, variables are used to store information that can be referenced and manipulated in a program.",
        chapterId: chapter2.id,
      });
    }

    // Articles for Web Development
    const webArticle1Exists = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.title, "Introduction to React"),
          eq(articles.chapterId, webChapter1.id)
        )
      );
    if (webArticle1Exists.length === 0) {
      await db.insert(articles).values({
        title: "Introduction to React",
        content:
          "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
        chapterId: webChapter1.id,
      });
    }

    const webArticle2Exists = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.title, "TypeScript Basics"),
          eq(articles.chapterId, webChapter2.id)
        )
      );
    if (webArticle2Exists.length === 0) {
      await db.insert(articles).values({
        title: "TypeScript Basics",
        content:
          "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and class-based object-oriented programming to JavaScript.",
        chapterId: webChapter2.id,
      });
    }

    // Add videos
    const video1Exists = await db
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.title, "React in 100 Seconds"),
          eq(videos.chapterId, webChapter1.id)
        )
      );
    if (video1Exists.length === 0) {
      await db.insert(videos).values({
        title: "React in 100 Seconds",
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        chapterId: webChapter1.id,
      });
    }

    const video2Exists = await db
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.title, "TypeScript in 100 Seconds"),
          eq(videos.chapterId, webChapter2.id)
        )
      );
    if (video2Exists.length === 0) {
      await db.insert(videos).values({
        title: "TypeScript in 100 Seconds",
        videoUrl: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA",
        chapterId: webChapter2.id,
      });
    }

    const video3Exists = await db
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.title, "Next.js in 100 Seconds"),
          eq(videos.chapterId, webChapter1.id)
        )
      );
    if (video3Exists.length === 0) {
      await db.insert(videos).values({
        title: "Next.js in 100 Seconds",
        videoUrl: "https://www.youtube.com/watch?v=Sklc_fQBmcs",
        chapterId: webChapter1.id,
      });
    }

    // --- CHAT ---
    let [chat] = await db
      .select()
      .from(chats)
      .where(
        and(eq(chats.user1Id, student.id), eq(chats.user2Id, instructor.id))
      );
    if (!chat) {
      [chat] = await db
        .insert(chats)
        .values({
          user1Id: student.id,
          user2Id: instructor.id,
        })
        .returning();
    }

    // --- MESSAGES ---
    const msg1Exists = await db
      .select()
      .from(messages)
      .where(
        and(eq(messages.chatId, chat.id), eq(messages.senderId, student.id))
      );
    if (msg1Exists.length === 0) {
      await db.insert(messages).values({
        chatId: chat.id,
        senderId: student.id,
        content: "Hello, I have a question about the course.",
      });
    }
    const msg2Exists = await db
      .select()
      .from(messages)
      .where(
        and(eq(messages.chatId, chat.id), eq(messages.senderId, instructor.id))
      );
    if (msg2Exists.length === 0) {
      await db.insert(messages).values({
        chatId: chat.id,
        senderId: instructor.id,
        content: "Hi! I'm here to help. What would you like to know?",
      });
    }

    // --- SKILL TRANSFERS ---
    // Pending skill transfer
    let [pendingTransfer] = await db
      .select()
      .from(skillTransfers)
      .where(
        and(
          eq(skillTransfers.studentId, studentProfile.id),
          eq(skillTransfers.teacherId, teacherStudentProfile.id),
          eq(skillTransfers.skillId, programmingSkill.id),
          eq(skillTransfers.status, SkillTransferStatus.PENDING)
        )
      );
    if (!pendingTransfer) {
      [pendingTransfer] = await db
        .insert(skillTransfers)
        .values({
          studentId: studentProfile.id,
          teacherId: teacherStudentProfile.id,
          skillId: programmingSkill.id,
          points: 10,
          done: false,
          status: SkillTransferStatus.PENDING,
        } as SkillTransfer)
        .returning();
    }

    // In Progress skill transfer
    let [inProgressTransfer] = await db
      .select()
      .from(skillTransfers)
      .where(
        and(
          eq(skillTransfers.studentId, studentProfile.id),
          eq(skillTransfers.teacherId, teacherStudentProfile.id),
          eq(skillTransfers.skillId, designSkill.id),
          eq(skillTransfers.status, SkillTransferStatus.IN_PROGRESS)
        )
      );
    if (!inProgressTransfer) {
      [inProgressTransfer] = await db
        .insert(skillTransfers)
        .values({
          studentId: studentProfile.id,
          teacherId: teacherStudentProfile.id,
          skillId: designSkill.id,
          points: 15,
          done: false,
          status: SkillTransferStatus.IN_PROGRESS,
        } as SkillTransfer)
        .returning();
    }

    // Finished skill transfer
    let [finishedTransfer] = await db
      .select()
      .from(skillTransfers)
      .where(
        and(
          eq(skillTransfers.studentId, studentProfile.id),
          eq(skillTransfers.teacherId, teacherStudentProfile.id),
          eq(skillTransfers.skillId, programmingSkill.id),
          eq(skillTransfers.status, SkillTransferStatus.FINISHED)
        )
      );
    if (!finishedTransfer) {
      [finishedTransfer] = await db
        .insert(skillTransfers)
        .values({
          studentId: studentProfile.id,
          teacherId: teacherStudentProfile.id,
          skillId: programmingSkill.id,
          points: 20,
          done: true,
          status: SkillTransferStatus.FINISHED,
        } as SkillTransfer)
        .returning();
    }

    // --- SESSIONS ---
    // Session for pending transfer
    const pendingSessionExists = await db
      .select()
      .from(sessions)
      .where(eq(sessions.skillTransferId, pendingTransfer.id));
    if (pendingSessionExists.length === 0) {
      await db.insert(sessions).values({
        skillTransferId: pendingTransfer.id,
        title: "Introduction to Programming",
        points: 10,
        completed: false,
        paid: false,
      } as Session);
    }

    // Add enrollment for student to Modern Web Development course
    const enrollmentExists = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, studentProfile.id),
          eq(enrollments.courseId, webDevCourse.id)
        )
      );
    if (enrollmentExists.length === 0) {
      await db.insert(enrollments).values({
        studentId: studentProfile.id,
        courseId: webDevCourse.id,
        paid: 1, // true
        enrolledAt: new Date(),
      });
    }

    // Multiple sessions for in-progress transfer
    const inProgressSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.skillTransferId, inProgressTransfer.id));
    if (inProgressSessions.length === 0) {
      // First session (completed)
      await db.insert(sessions).values({
        skillTransferId: inProgressTransfer.id,
        title: "Design Fundamentals - Part 1",
        points: 5,
        completed: true,
        paid: true,
      } as Session);

      // Second session (in progress)
      await db.insert(sessions).values({
        skillTransferId: inProgressTransfer.id,
        title: "Design Fundamentals - Part 2",
        points: 5,
        completed: false,
        paid: true,
      } as Session);

      // Third session (not started)
      await db.insert(sessions).values({
        skillTransferId: inProgressTransfer.id,
        title: "Design Fundamentals - Part 3",
        points: 5,
        completed: false,
        paid: false,
      } as Session);
    }

    // Completed sessions for finished transfer
    const finishedSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.skillTransferId, finishedTransfer.id));
    if (finishedSessions.length === 0) {
      // First session
      await db.insert(sessions).values({
        skillTransferId: finishedTransfer.id,
        title: "Advanced Programming - Session 1",
        points: 7,
        completed: true,
        paid: true,
      } as Session);

      // Second session
      await db.insert(sessions).values({
        skillTransferId: finishedTransfer.id,
        title: "Advanced Programming - Session 2",
        points: 7,
        completed: true,
        paid: true,
      } as Session);

      // Third session
      await db.insert(sessions).values({
        skillTransferId: finishedTransfer.id,
        title: "Advanced Programming - Session 3",
        points: 6,
        completed: true,
        paid: true,
      } as Session);
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run the seeder
seed().catch(console.error);
