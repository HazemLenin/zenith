import React, { useState, useEffect, useCallback, useContext } from "react";
import { Spinner, Alert } from "flowbite-react";
import { CourseCard, Input } from "../components";
import { UserContext } from "../context/UserContext";

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

const SearchCourses: React.FC = () => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChangeFun={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {error && (
        <Alert color="failure">
          <span>{error}</span>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
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

export default SearchCourses;
