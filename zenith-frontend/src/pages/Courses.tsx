import React, { useState, useEffect, useCallback, useContext } from "react";
import { Spinner, Alert } from "../components";
import { Input, Card } from "../components";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faChevronUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

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

type SortOption =
  | "price-asc"
  | "price-desc"
  | "title-asc"
  | "title-desc"
  | "instructor-asc"
  | "instructor-desc";

const Courses: React.FC = () => {
  const { userToken } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [courseLevel, setCourseLevel] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (courses.length > 0) {
      const prices = courses.map((course) => course.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [courses]);

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

  const sortCourses = useCallback(
    (coursesToSort: Course[]) => {
      return [...coursesToSort].sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "instructor-asc":
            return `${a.instructor.firstName} ${a.instructor.lastName}`.localeCompare(
              `${b.instructor.firstName} ${b.instructor.lastName}`
            );
          case "instructor-desc":
            return `${b.instructor.firstName} ${b.instructor.lastName}`.localeCompare(
              `${a.instructor.firstName} ${a.instructor.lastName}`
            );
          default:
            return 0;
        }
      });
    },
    [sortBy]
  );

  const filterCourses = useCallback(
    (coursesToFilter: Course[]) => {
      return coursesToFilter.filter((course) => {
        const matchesPrice =
          course.price >= priceRange[0] && course.price <= priceRange[1];
        const matchesLevel =
          courseLevel === "all" ||
          (courseLevel === "basic" && course.price <= 50) ||
          (courseLevel === "premium" && course.price > 50);
        return matchesPrice && matchesLevel;
      });
    },
    [priceRange, courseLevel]
  );

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

  const sortedAndFilteredCourses = filterCourses(sortCourses(courses));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row min-h-screen relative">
        {/* Mobile Sidebar Toggle */}
        <button
          className="lg:hidden fixed top-4 right-16 z-50 bg-primary text-white p-3 flex items-center gap-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span className="text-sm font-medium">Filters</span>
        </button>

        {/* Sidebar */}
        <div
          className={`
          fixed lg:static w-full lg:w-1/3 bg-white shadow-lg lg:shadow-none
          transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? "top-20" : "-top-full lg:top-0"}
          h-screen lg:h-auto overflow-y-auto
        `}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filters & Sort</h2>
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChangeFun={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between
                    ${
                      sortBy === "price-asc"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSortBy("price-asc")}
                >
                  <span>Price: Low to High</span>
                  <FontAwesomeIcon icon={faSortUp} />
                </button>
                <button
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between
                    ${
                      sortBy === "price-desc"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSortBy("price-desc")}
                >
                  <span>Price: High to Low</span>
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
                <button
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between
                    ${
                      sortBy === "title-asc"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSortBy("title-asc")}
                >
                  <span>Title: A to Z</span>
                  <FontAwesomeIcon icon={faSortUp} />
                </button>
                <button
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between
                    ${
                      sortBy === "title-desc"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSortBy("title-desc")}
                >
                  <span>Title: Z to A</span>
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <span className="text-sm whitespace-nowrap">
                    ${priceRange[1]}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Course Level Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Course Level</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left p-2 rounded-lg
                    ${
                      courseLevel === "all"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCourseLevel("all")}
                >
                  All Courses
                </button>
                <button
                  className={`w-full text-left p-2 rounded-lg
                    ${
                      courseLevel === "basic"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCourseLevel("basic")}
                >
                  Basic
                </button>
                <button
                  className={`w-full text-left p-2 rounded-lg
                    ${
                      courseLevel === "premium"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCourseLevel("premium")}
                >
                  Premium
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {sortedAndFilteredCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <Card className="group h-full bg-white relative overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl">
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

          {!loading && !error && sortedAndFilteredCourses.length === 0 && (
            <div className="text-center text-gray-500">
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
