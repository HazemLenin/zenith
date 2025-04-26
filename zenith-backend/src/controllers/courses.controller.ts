import { Request, Response } from "express";
import { db } from "../db";
import {
  courses,
  courseChapters,
  videos,
  articles,
  enrollments,
  users,
} from "../models";
import {
  CourseUploadViewModel,
  CourseListViewModel,
  CourseDetailsViewModel,
  CourseEnrollmentViewModel,
  ChapterDetailsViewModel,
} from "../viewmodels/course.viewmodel";
import { eq, and, sql, InferInsertModel } from "drizzle-orm";
import PDFDocument from "pdfkit";

type NewCourse = InferInsertModel<typeof courses>;
type NewEnrollment = InferInsertModel<typeof enrollments>;

export class CoursesController {
  // Upload course (instructor only)
  static async uploadCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData: CourseUploadViewModel = req.body;
      const instructorId = req.user!.id;

      // Start a transaction
      const result = await db.transaction(async (tx) => {
        // Create course
        const [course] = await tx
          .insert(courses)
          .values({
            title: courseData.title,
            description: courseData.description,
            price: courseData.price,
            instructorId: instructorId,
          } as NewCourse)
          .returning();

        // Create chapters, videos, and articles
        for (const chapter of courseData.chapters) {
          const [chapterRecord] = await tx
            .insert(courseChapters)
            .values({
              courseId: course.id,
              title: chapter.title,
              orderIndex: chapter.order,
            })
            .returning();

          // Create videos
          for (const video of chapter.videos) {
            await tx.insert(videos).values({
              title: video.title,
              videoUrl: video.url,
              chapterId: chapterRecord.id,
            });
          }

          // Create articles
          for (const article of chapter.articles) {
            await tx.insert(articles).values({
              title: article.title,
              content: article.content,
              chapterId: chapterRecord.id,
            });
          }
        }

        return course;
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Error uploading course:", error);
      res.status(500).json({ message: "Error uploading course" });
    }
  }

  // Get all courses with search
  static async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = (req.query.search as string) || "";

      const courseList = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          price: courses.price,
          instructorId: courses.instructorId,
        })
        .from(courses)
        .where(
          searchQuery
            ? sql`${courses.title} LIKE ${`%${searchQuery}%`} OR ${
                courses.description
              } LIKE ${`%${searchQuery}%`}`
            : undefined
        );

      res.json(courseList);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  }

  // Get course details
  static async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.id);

      const course = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          price: courses.price,
          instructorId: courses.instructorId,
          chaptersCount:
            sql<number>`(SELECT COUNT(*) FROM ${courseChapters} WHERE ${courseChapters.courseId} = ${courses.id})`.as(
              "chaptersCount"
            ),
        })
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course.length) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      res.json(course[0]);
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ message: "Error fetching course details" });
    }
  }

  // Get instructor's courses
  static async getMyCourses(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.user!.id;
      const searchQuery = (req.query.search as string) || "";

      const courseList = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          price: courses.price,
          instructorId: courses.instructorId,
        })
        .from(courses)
        .where(
          and(
            eq(courses.instructorId, instructorId),
            searchQuery
              ? sql`${courses.title} LIKE ${`%${searchQuery}%`} OR ${
                  courses.description
                } LIKE ${`%${searchQuery}%`}`
              : undefined
          )
        );

      res.json(courseList);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      res.status(500).json({ message: "Error fetching instructor courses" });
    }
  }

  // Enroll student in course
  static async enrollStudent(req: Request, res: Response): Promise<void> {
    try {
      const enrollmentData: CourseEnrollmentViewModel = req.body;
      const studentId = req.user!.id;

      // Check if student is already enrolled
      const existingEnrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, enrollmentData.courseId),
            eq(enrollments.studentId, studentId)
          )
        )
        .limit(1);

      if (existingEnrollment.length) {
        res
          .status(400)
          .json({ message: "Student is already enrolled in this course" });
        return;
      }

      // Create enrollment
      const [enrollment] = await db
        .insert(enrollments)
        .values({
          courseId: enrollmentData.courseId,
          studentId: studentId,
          paid: false,
        } as NewEnrollment)
        .returning();

      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling student:", error);
      res.status(500).json({ message: "Error enrolling student" });
    }
  }

  // Get course chapters
  static async getCourseChapters(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.id);

      const chapters = await db
        .select({
          id: courseChapters.id,
          title: courseChapters.title,
          orderIndex: courseChapters.orderIndex,
        })
        .from(courseChapters)
        .where(eq(courseChapters.courseId, courseId))
        .orderBy(courseChapters.orderIndex);

      if (!chapters.length) {
        res.status(404).json({ message: "No chapters found for this course" });
        return;
      }

      res.json(chapters);
    } catch (error) {
      console.error("Error fetching course chapters:", error);
      res.status(500).json({ message: "Error fetching course chapters" });
    }
  }

  // Get chapter details for enrolled users
  static async getChapterDetails(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.courseId);
      const chapterId = parseInt(req.params.chapterId);
      const userId = req.user!.id;

      // Check if user is enrolled in the course
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, courseId),
            eq(enrollments.studentId, userId)
          )
        )
        .limit(1);

      if (!enrollment.length) {
        res.status(403).json({
          message:
            "You must be enrolled in this course to view chapter details",
        });
        return;
      }

      // Get chapter details
      const [chapter] = await db
        .select({
          id: courseChapters.id,
          title: courseChapters.title,
          orderIndex: courseChapters.orderIndex,
        })
        .from(courseChapters)
        .where(
          and(
            eq(courseChapters.id, chapterId),
            eq(courseChapters.courseId, courseId)
          )
        )
        .limit(1);

      if (!chapter) {
        res.status(404).json({ message: "Chapter not found" });
        return;
      }

      // Get videos for the chapter
      const chapterVideos = await db
        .select({
          id: videos.id,
          title: videos.title,
          videoUrl: videos.videoUrl,
        })
        .from(videos)
        .where(eq(videos.chapterId, chapterId));

      // Get articles for the chapter
      const chapterArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          content: articles.content,
        })
        .from(articles)
        .where(eq(articles.chapterId, chapterId));

      const response: ChapterDetailsViewModel = {
        ...chapter,
        videos: chapterVideos,
        articles: chapterArticles,
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching chapter details:", error);
      res.status(500).json({ message: "Error fetching chapter details" });
    }
  }

  // Generate course completion certificate as PDF
  static async generateCertificate(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user!.id;

      // Check if user is enrolled in the course
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, courseId),
            eq(enrollments.studentId, userId)
          )
        )
        .limit(1);

      if (!enrollment.length) {
        res.status(403).json({
          message:
            "You must be enrolled in this course to generate a certificate",
        });
        return;
      }

      // Get user and course details
      const [userDetails] = await db
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const [courseDetails] = await db
        .select({
          title: courses.title,
        })
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!userDetails || !courseDetails) {
        res.status(404).json({ message: "User or course not found" });
        return;
      }

      // Create PDF document
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
      });

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=certificate-${courseId}-${userId}.pdf`
      );

      // Pipe the PDF to the response
      doc.pipe(res);

      // Add certificate content
      // Set background color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#e3f2fd");

      // Add border
      const margin = 20;
      doc
        .rect(
          margin,
          margin,
          doc.page.width - margin * 2,
          doc.page.height - margin * 2
        )
        .strokeColor("#2a5c8a")
        .lineWidth(3)
        .stroke();

      // Add certificate title
      doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor("#2a5c8a")
        .text("Certificate of Completion", 0, 100, {
          align: "center",
        });

      // Add student name
      doc
        .font("Helvetica-Bold")
        .fontSize(30)
        .fillColor("#2f327d")
        .text(`${userDetails.firstName} ${userDetails.lastName}`, 0, 200, {
          align: "center",
        });

      // Add completion text
      doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor("#333333")
        .text("has successfully completed the course", 0, 250, {
          align: "center",
        });

      // Add course title
      doc
        .font("Helvetica-Bold")
        .fontSize(25)
        .fillColor("#2f327d")
        .text(courseDetails.title, 0, 300, {
          align: "center",
        });

      // Add date
      doc
        .font("Helvetica")
        .fontSize(15)
        .fillColor("#333333")
        .text(`Issued on ${new Date().toLocaleDateString()}`, 0, 400, {
          align: "center",
        });

      // Add certificate ID at the bottom
      const certificateId = `CERT-${courseId}-${userId}-${Date.now()}`;
      doc.fontSize(10).text(certificateId, 0, doc.page.height - 50, {
        align: "center",
      });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Error generating certificate" });
    }
  }
}
