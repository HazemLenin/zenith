import React, { useState, useEffect, useCallback, useContext } from "react";
import { Spinner, Alert } from "../components";
import { Input, Card } from "../components";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    id: 0;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  };
}

const Courses: React.FC = () => {
  const { userToken } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const searchCourses = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:3000/api/courses`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        const filtered = data.filter((course: Course) =>
          course.title.toLowerCase().includes(query.toLowerCase())
        );
        setCourses(filtered);
      } catch (error) {
        setError("Error fetching courses. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:3000/api/courses`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError("Error fetching courses. Please try again.");
      console.error(error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (!searchQuery) {
      fetchAllCourses();
      return;
    }

    const debounceSearch = setTimeout(() => {
      searchCourses(searchQuery);
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery, searchCourses, fetchAllCourses]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChangeFun={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert color="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link to={`/courses/${course.id}`}>
            <Card
              key={course.id}
              className="group h-full bg-white relative overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary to-primary/80 transform -skew-y-6 origin-top-left group-hover:skew-y-0 transition-transform duration-500" />
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary/80 to-primary/60 transform skew-y-6 origin-top-right group-hover:skew-y-0 transition-transform duration-500" />
              <div className="absolute top-3 right-3 z-10">
                <div className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-sm font-bold rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  {course.price > 50 ? "Premium" : "Basic"}
                </div>
              </div>
              <div className="flex flex-col w-full h-full p-6 relative z-10">
                <div className="mb-4 mt-12">
                  <div className="flex items-center gap-2 mb-3">
                    <Link
                      to={`/users/${course.instructor.username}`}
                      className="flex -space-x-2 group/instructor hover:scale-105 transition-transform duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white group-hover/instructor:border-primary/30 transition-colors">
                        <span className="text-primary text-sm font-medium">
                          {course.instructor.firstName[0]}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white group-hover/instructor:border-primary/30 transition-colors">
                        <span className="text-primary text-sm font-medium">
                          {course.instructor.lastName[0]}
                        </span>
                      </div>
                    </Link>
                    <span className="text-sm text-gray-600">Teaching</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2 flex-grow">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100/50">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                      ${course.price}
                    </span>
                    <span className="text-sm text-gray-400">USD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <Link
                        to={`/users/${course.instructor.username}`}
                        className="text-sm font-medium text-gray-700 hover:text-primary transition-colors flex items-center gap-1 group/link"
                      >
                        {course.instructor.firstName}{" "}
                        {course.instructor.lastName}
                        <svg
                          className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                      <span className="text-xs text-gray-400">
                        View Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {!loading && !error && courses.length === 0 && searchQuery && (
        <div className="text-center text-gray-500">
          No courses found matching your search.
        </div>
      )}
    </div>
  );
};

export default Courses;
