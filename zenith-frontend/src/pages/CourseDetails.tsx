import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button/Button";
import {
  faChartColumn,
  faCalendarDays,
  faUserTie,
  faUsers,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: Instructor;
  chaptersCount: number;
  enrollmentCount: number;
  createdAt: string;
  isEnrolled: boolean;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userToken, currentUser } = useContext(UserContext);

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    async function getCourseDetails() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get<Course>(
          `http://localhost:3000/api/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setCourse(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load course details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    getCourseDetails();
  }, [id, userToken]);

  const handleEnroll = async () => {
    if (!id) return;

    setIsEnrolling(true);
    try {
      await axios.post(
        `http://localhost:3000/api/courses/enroll`,
        { courseId: parseInt(id) },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      navigate(`/courses/${id}/chapters`);
    } catch (err) {
      console.error("Enrollment Error:", err);
      setError("Failed to enroll in course. Please try again.");
    } finally {
      setIsEnrolling(false);
      closeModal();
    }
  };

  const createdAtFormatted =
    course?.createdAt && !isNaN(new Date(course.createdAt).getTime())
      ? new Date(course.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "invalid";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RingLoader color="#00A3A3" size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-56 bg-red-50 p-6 rounded-xl shadow-md max-w-md mx-auto text-center">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-red-600 mb-4"
          style={{ fontSize: "48px" }}
        />
        <p className="text-red-700 text-lg font-semibold mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="flex flex-col-reverse lg:flex-row gap-6 px-10 py-10">
        <div className="lg:w-2/3 h-full max-h-screen overflow-y-auto pr-2">
          <h1 className="text-center mb-5 text-4xl font-extrabold text-black tracking-tight relative inline-block">
            {course?.title}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full shadow-md"></span>
          </h1>

          <div className="p-5">
            <div className="flex flex-wrap gap-5">
              {[...Array(course?.chaptersCount ?? 0)].map((_, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[45%] px-5 py-4 text-center bg-white text-black rounded-xl shadow-md border border-primary font-medium"
                >
                  Chapter {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 bg-white shadow-md rounded-xl h-fit">
          <div className="p-6">
            <div className="text-3xl font-bold text-black mb-1 text-center">
              ${course?.price?.toFixed(2) ?? 0}
            </div>

            <div className="text-sm text-black mt-5 mb-2">
              <FontAwesomeIcon
                icon={faChartColumn}
                className="me-2 text-primary"
              />
              <strong>Modules:</strong> {course?.chaptersCount || "invalid"}
            </div>

            <div className="text-sm text-black mb-2">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="me-2 text-primary"
              />
              <strong>Created At:</strong> {createdAtFormatted}
            </div>

            <div className="text-sm text-black mb-2">
              <FontAwesomeIcon icon={faUserTie} className="me-2 text-primary" />
              <strong>Instructor:</strong>{" "}
              <Link
                to={`/users/${course?.instructor?.username}`}
                className="text-primary hover:text-blue-600 transition-colors font-bold underline"
              >
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </Link>
            </div>

            <div className="text-sm text-black mb-4">
              <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
              <strong>Enrolled Students:</strong> {course?.enrollmentCount || 0}
            </div>

            <div className="p-6">
              {course?.isEnrolled ? (
                <Link to={`/courses/${id}/chapters`}>
                  <Button variant="primary">Go to Course</Button>
                </Link>
              ) : currentUser?.role === "instructor" ? null : (
                <Button onClick={openModal} variant="primary">
                  Buy Now
                </Button>
              )}

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full relative">
                    <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>
                    <p className="mb-6">
                      Are you sure you want to buy this Course?
                    </p>
                    <div className="flex justify-center gap-3 p-9">
                      <Button
                        onClick={closeModal}
                        disabled={isEnrolling}
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        variant="primary"
                      >
                        {isEnrolling ? "Enrolling..." : "Confirm"}
                      </Button>
                    </div>
                    <button
                      onClick={closeModal}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                      aria-label="Close modal"
                      disabled={isEnrolling}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-black mb-2">
                This Course Includes
              </div>
              <p className="text-black text-sm">
                {course?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
