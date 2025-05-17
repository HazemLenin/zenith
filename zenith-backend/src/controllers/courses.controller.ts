import { Request, Response } from "express";
import { db } from "../db";
import {
  courses,
  courseChapters,
  videos,
  articles,
  enrollments,
  users,
  instructorProfiles,
  studentProfiles,
} from "../models";
import { eq, and, sql, InferInsertModel } from "drizzle-orm";
import PDFDocument from "pdfkit";
import { CourseUploadViewModel } from "../viewmodels/course/courseUpload.viewmodel";
import { CourseEnrollmentViewModel } from "../viewmodels/course/courseEnrollment.viewmodel";
import { ChapterDetailsViewModel } from "../viewmodels/course/chapterDetails.viewmodel";
import { ErrorViewModel } from "../viewmodels/error.viewmodel";

type NewCourse = InferInsertModel<typeof courses>;
type NewEnrollment = InferInsertModel<typeof enrollments>;

export class CoursesController {
  // Upload course (instructor only)
  static async uploadCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData: CourseUploadViewModel = req.body;
      const userId = req.user!.id;

      // Get instructor profile ID
      const instructorProfile = await db
        .select({ id: instructorProfiles.id })
        .from(instructorProfiles)
        .where(eq(instructorProfiles.userId, userId))
        .limit(1);

      if (!instructorProfile.length) {
        res
          .status(403)
          .json(ErrorViewModel.forbidden("User is not an instructor").toJSON());
        return;
      }

      // Start a transaction
      const result = await db.transaction(async (tx) => {
        // Create course
        const [course] = await tx
          .insert(courses)
          .values({
            title: courseData.title,
            description: courseData.description,
            price: courseData.price,
            instructorId: instructorProfile[0].id,
          } as NewCourse)
          .returning();

        // Create chapters, videos, and articles
        for (let i = 0; i < courseData.chapters.length; i++) {
          const chapter = courseData.chapters[i];
          const [chapterRecord] = await tx
            .insert(courseChapters)
            .values({
              courseId: course.id,
              title: chapter.title,
              orderIndex: i, // Use array index as order
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
      res
        .status(500)
        .json(ErrorViewModel.internalError("Error uploading course").toJSON());
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
          instructor: {
            id: courses.instructorId,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username,
          },
        })
        .from(courses)
        .leftJoin(users, eq(users.instructorProfileId, courses.instructorId))
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
      res
        .status(500)
        .json(ErrorViewModel.internalError("Error fetching courses").toJSON());
    }
  }

  // Get course details
  static async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Get student profile ID if user is a student
      let studentProfileId: number | null = null;
      const studentProfile = await db
        .select({ id: studentProfiles.id })
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .limit(1);

      if (studentProfile.length) {
        studentProfileId = studentProfile[0].id;
      }

      const course = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          price: courses.price,
          instructor: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username,
          },
          chaptersCount:
            sql<number>`(SELECT COUNT(*) FROM ${courseChapters} WHERE ${courseChapters.courseId} = ${courses.id})`.as(
              "chaptersCount"
            ),
          enrollmentCount:
            sql<number>`(SELECT COUNT(*) FROM ${enrollments} WHERE ${enrollments.courseId} = ${courses.id})`.as(
              "enrollmentCount"
            ),
        })
        .from(courses)
        .leftJoin(
          instructorProfiles,
          eq(instructorProfiles.id, courses.instructorId)
        )
        .leftJoin(users, eq(users.id, instructorProfiles.userId))
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course.length) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Course not found").toJSON());
        return;
      }

      // Check if user is enrolled
      let isEnrolled = false;
      if (studentProfileId) {
        const enrollment = await db
          .select()
          .from(enrollments)
          .where(
            and(
              eq(enrollments.courseId, courseId),
              eq(enrollments.studentId, studentProfileId)
            )
          )
          .limit(1);
        isEnrolled = enrollment.length > 0;
      }

      res.json({
        ...course[0],
        isEnrolled,
      });
    } catch (error) {
      console.error("Error fetching course details:", error);
      res
        .status(500)
        .json(
          ErrorViewModel.internalError("Error fetching course details").toJSON()
        );
    }
  }

  // Get instructor's courses
  static async getInstructorCourses(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const username = req.params.username;
      const searchQuery = (req.query.search as string) || "";

      // First get the instructor's ID from their username
      const instructor = await db
        .select({
          id: instructorProfiles.id,
        })
        .from(instructorProfiles)
        .leftJoin(users, eq(users.id, instructorProfiles.userId))
        .where(eq(users.username, username))
        .limit(1);

      if (!instructor.length) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Instructor not found").toJSON());
        return;
      }

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
            eq(courses.instructorId, instructor[0].id),
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
      res
        .status(500)
        .json(
          ErrorViewModel.internalError(
            "Error fetching instructor courses"
          ).toJSON()
        );
    }
  }

  // Enroll student in course
  static async enrollStudent(req: Request, res: Response): Promise<void> {
    try {
      const enrollmentData: CourseEnrollmentViewModel = req.body;
      const userId = req.user!.id;

      // Get student profile ID
      const studentProfile = await db
        .select({ id: studentProfiles.id })
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .limit(1);

      if (!studentProfile.length) {
        res
          .status(400)
          .json(
            ErrorViewModel.validationError("Student profile not found").toJSON()
          );
        return;
      }

      // Check if student is already enrolled
      const existingEnrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, enrollmentData.courseId),
            eq(enrollments.studentId, studentProfile[0].id)
          )
        )
        .limit(1);

      if (existingEnrollment.length) {
        res
          .status(400)
          .json(
            ErrorViewModel.validationError(
              "Student is already enrolled in this course"
            ).toJSON()
          );
        return;
      }

      const course = await db
        .select({ price: courses.price })
        .from(courses)
        .where(eq(courses.id, enrollmentData.courseId))
        .limit(1);

      if (!course.length) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Course not found").toJSON());
        return;
      }

      // Create enrollment
      const [enrollment] = await db
        .insert(enrollments)
        .values({
          courseId: enrollmentData.courseId,
          studentId: studentProfile[0].id,
          paid: course[0].price,
        } as NewEnrollment)
        .returning();

      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling student:", error);
      res
        .status(500)
        .json(ErrorViewModel.internalError("Error enrolling student").toJSON());
    }
  }

  // Get course chapters
  static async getCourseChapters(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.id);

      // First check if course exists
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course.length) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Course not found").toJSON());
        return;
      }

      const chapters = await db
        .select({
          id: courseChapters.id,
          title: courseChapters.title,
          orderIndex: courseChapters.orderIndex,
        })
        .from(courseChapters)
        .where(eq(courseChapters.courseId, courseId))
        .orderBy(courseChapters.orderIndex);

      // Return empty array if no chapters found instead of 404
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching course chapters:", error);
      res
        .status(500)
        .json(
          ErrorViewModel.internalError(
            "Error fetching course chapters"
          ).toJSON()
        );
    }
  }

  // Get chapter details for enrolled users
  static async getChapterDetails(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, chapterId } = req.params;
      const userId = req.user!.id;

      // Get student profile ID
      const studentProfile = await db
        .select({ id: studentProfiles.id })
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .limit(1);

      if (!studentProfile.length) {
        res
          .status(400)
          .json(
            ErrorViewModel.validationError("Student profile not found").toJSON()
          );
        return;
      }

      // Check if user is enrolled
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, parseInt(courseId)),
            eq(enrollments.studentId, studentProfile[0].id)
          )
        )
        .limit(1);

      if (!enrollment.length) {
        res
          .status(403)
          .json(
            ErrorViewModel.forbidden(
              "You must be enrolled in this course to view chapter details"
            ).toJSON()
          );
        return;
      }

      const chapter = await db
        .select()
        .from(courseChapters)
        .where(eq(courseChapters.id, parseInt(chapterId)))
        .limit(1);

      if (!chapter.length) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Chapter not found").toJSON());
        return;
      }

      const chapterVideos = await db
        .select()
        .from(videos)
        .where(eq(videos.chapterId, parseInt(chapterId)));

      const chapterArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.chapterId, parseInt(chapterId)));

      const response: ChapterDetailsViewModel = {
        id: chapter[0].id,
        title: chapter[0].title,
        orderIndex: chapter[0].orderIndex,
        videos: chapterVideos.map((video) => ({
          id: video.id,
          title: video.title,
          videoUrl: video.videoUrl,
        })),
        articles: chapterArticles.map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
        })),
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching chapter details:", error);
      res
        .status(500)
        .json(
          ErrorViewModel.internalError(
            "Error fetching chapter details"
          ).toJSON()
        );
    }
  }

  // Generate certificate for completed course
  static async generateCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const studentId = req.user!.id;

      // Check if student is enrolled
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, parseInt(courseId)),
            eq(enrollments.studentId, studentId)
          )
        )
        .limit(1);

      if (!enrollment.length) {
        res
          .status(403)
          .json(
            ErrorViewModel.forbidden(
              "You must be enrolled in this course to generate a certificate"
            ).toJSON()
          );
        return;
      }

      // Generate PDF certificate
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=certificate-${courseId}-${studentId}.pdf`
        );
        res.send(pdfBuffer);
      });

      // Add content to PDF
      doc.fontSize(25).text("Certificate of Completion", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(16)
        .text(`Course: ${enrollment[0].courseId}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Student ID: ${studentId}`, { align: "center" });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

      doc.end();
    } catch (error) {
      console.error("Error generating certificate:", error);
      res
        .status(500)
        .json(
          ErrorViewModel.internalError("Error generating certificate").toJSON()
        );
    }
  }
}
