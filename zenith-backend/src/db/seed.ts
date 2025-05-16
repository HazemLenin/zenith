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
          coursesCount: 0,
        })
        .returning();
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
      });
    }

    // --- STUDENT SKILL ---
    const studentSkillExists = await db
      .select()
      .from(studentSkills)
      .where(
        and(
          eq(studentSkills.studentId, studentProfile.id),
          eq(studentSkills.skillId, programmingSkill.id)
        )
      );
    if (studentSkillExists.length === 0) {
      await db.insert(studentSkills).values({
        studentId: studentProfile.id,
        skillId: programmingSkill.id,
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
        })
        .returning();
    }

    // --- CHAPTER ---
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

    // --- ARTICLE ---
    const articleExists = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.title, "What is Programming?"),
          eq(articles.chapterId, chapter1.id)
        )
      );
    if (articleExists.length === 0) {
      await db.insert(articles).values({
        title: "What is Programming?",
        content:
          "Programming is the process of creating a set of instructions...",
        chapterId: chapter1.id,
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
