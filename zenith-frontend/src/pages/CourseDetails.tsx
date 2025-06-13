import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Spinner, Button, Modal } from "../components";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "../context/ToastContext";
import {
  faChartColumn,
  faUserTie,
  faUsers,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: Instructor;
  chaptersCount: number;
  enrollmentCount: number;
  isEnrolled: boolean;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userToken, currentUser } = useContext(UserContext);
  const { showToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    setIsLoading(true);
    setError("");
    axios
      .get<Course>(`http://localhost:3000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(({ data }) => {
        setCourse(data);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        const errorMessage = "Failed to load course details. Please try again.";
        setError(errorMessage);
        showToast(errorMessage, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, userToken, showToast]);

  const handleEnroll = () => {
    if (!id) return;

    setIsEnrolling(true);
    axios
      .post(
        `http://localhost:3000/api/courses/enroll`,
        { courseId: parseInt(id) },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        navigate(`/courses/${id}/chapters`);
      })
      .catch((err) => {
        console.error("Enrollment Error:", err);
        showToast("Failed to enroll in course. Please try again.", "error");
      })
      .finally(() => {
        setIsEnrolling(false);
        closeModal();
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-red-500 mb-4"
            style={{ fontSize: "48px" }}
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {course?.title}
            </h1>

            <div className="space-y-4">
              {[...Array(course?.chaptersCount ?? 0)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  Chapter {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ${course?.price?.toFixed(2) ?? 0}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon
                    icon={faChartColumn}
                    className="w-5 h-5 mr-3 text-primary"
                  />
                  <span className="font-medium">Chapters:</span>
                  <span className="ml-2">{course?.chaptersCount}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="w-5 h-5 mr-3 text-primary"
                  />
                  <span className="font-medium">Instructor:</span>
                  <Link
                    to={`/users/${course?.instructor?.username}`}
                    className="ml-2 text-primary hover:text-blue-600 transition-colors"
                  >
                    {course?.instructor?.firstName}{" "}
                    {course?.instructor?.lastName}
                  </Link>
                </div>

                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="w-5 h-5 mr-3 text-primary"
                  />
                  <span className="font-medium">Enrolled Students:</span>
                  <span className="ml-2">{course?.enrollmentCount || 0}</span>
                </div>
              </div>

              <div className="mb-6">
                {course?.isEnrolled ? (
                  <Link to={`/courses/${id}/chapters`}>
                    <Button variant="primary" className="w-full">
                      Go to Course
                    </Button>
                  </Link>
                ) : currentUser?.role === "instructor" ? null : (
                  <Button
                    onClick={openModal}
                    variant="primary"
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  This Course Includes
                </h2>
                <p className="text-gray-700">
                  {course?.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Confirm Purchase"
        open={showModal}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
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
              isLoading={isEnrolling}
              loadingText="Enrolling..."
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to buy this Course?</p>
      </Modal>
    </div>
  );
}
