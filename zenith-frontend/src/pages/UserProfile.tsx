import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Spinner } from "../components";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface Skill {
  id: number;
  type: "learned" | "needed";
  title: string;
  description?: string;
  points?: number;
}

interface Course {
  id: string;
  title?: string;
  description?: string;
  price?: number;
}

interface Profile {
  id: number;
  points?: number;
  skills?: Skill[];
  coursesCount?: number;
}

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: "student" | "instructor";
}

interface UserData {
  user: User;
  profile: Profile;
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { userToken, currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await axios.get<UserData>(
          `http://localhost:3000/api/users/${username}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setData(res.data);

        // If user is instructor, fetch their courses
        if (res.data.user.role === "instructor") {
          const coursesRes = await axios.get<Course[]>(
            `http://localhost:3000/api/courses/instructor/${username}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          setCourses(coursesRes.data);
        }
      } catch {
        setData(null);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, userToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return <div>User not found</div>;
  }

  const { user, profile } = data;
  const fullName = `${user.firstName || "Unknown"} ${user.lastName || ""}`;
  const isStudent = user.role === "student";
  const isInstructor = user.role === "instructor";

  return (
    <div className="max-w-5xl mx-auto rounded-2xl shadow-xl p-8 bg-white">
      <div
        className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-8 gap-6"
        style={{ borderColor: "#e0e7ef" }}
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg bg-primary">
            {user.firstName?.[0] || "?"}
            {user.lastName?.[0] || ""}
          </div>
          <div>
            <h1
              className="text-3xl font-extrabold mb-1"
              style={{ color: "#2f327d" }}
            >
              {fullName}
            </h1>
            <p className="text-gray-600 text-sm">@{user.username}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>

        {isStudent && (
          <div className="font-semibold px-8 py-5 rounded-xl shadow text-center bg-primary text-white">
            <p className="uppercase tracking-wider text-xs">Points</p>
            <p className="text-3xl mt-1">{profile.points || 0}</p>
          </div>
        )}

        {isInstructor && (
          <div className="font-semibold px-8 py-5 rounded-xl shadow text-center bg-primary text-white">
            <p className="uppercase tracking-wider text-xs">Courses Count</p>
            <p className="text-3xl mt-1">{profile.coursesCount || 0}</p>
          </div>
        )}

        {currentUser?.username !== username && (
          <Link
            to={`/chat?userId=${user.id}`}
            className="font-semibold px-8 py-5 rounded-xl shadow text-center bg-secondary text-white hover:bg-secondary-dark transition-colors"
          >
            <p className="uppercase tracking-wider text-xs">Chat</p>
            <p className="text-xl mt-1">Message User</p>
          </Link>
        )}
      </div>

      {isStudent && (
        <>
          {currentUser?.username === username && (
            <div className="mb-6">
              <Link
                to={`/users/${username}/skills-update`}
                className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="w-5 h-5 mr-2"
                />
                Update Skills
              </Link>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {["learned", "needed"].map((type) => {
              if (!profile.skills) return null;
              const filteredSkills = profile.skills.filter(
                (s) => s.type === type
              );
              return (
                <div
                  key={type}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {type === "learned" ? "Learned Skills" : "Needed Skills"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <li
                          key={skill.id}
                          className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm"
                        >
                          <span className="text-gray-800 font-medium">
                            {skill.title}
                          </span>
                          {type === "learned" && (
                            <span className="flex gap-2 items-center text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {skill.points}
                              <img
                                className="w-8 h-8 ml-1.5"
                                src="/public/points.png"
                              />
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">
                        No skills added yet.
                      </p>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isInstructor && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary">Courses</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <div className="flex flex-col w-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No courses available.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default UserProfile;
