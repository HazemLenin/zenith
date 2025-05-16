import React, { useState, useEffect, useCallback } from "react";
import { TextInput, Spinner, Alert } from "flowbite-react";
import { CourseCard } from "../components";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const searchCourses = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        const filtered = data.filter((course: Course) =>
          course.title.toLowerCase().includes(query.toLowerCase())
        );
        setCourses(filtered);
      } catch (err) {
        setError("Error fetching courses. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/courses`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError("Error fetching courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
        <TextInput
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
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
          <CourseCard
            key={course.id}
            course={course}
            onReadMore={() => console.log("Read more about:", course.title)}
          />
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