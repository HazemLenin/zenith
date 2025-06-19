import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Spinner } from "../components";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faMessage } from "@fortawesome/free-solid-svg-icons";

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
        const res = await axios.get<UserData>(`/api/users/${username}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setData(res.data);

        // If user is instructor, fetch their courses
        if (res.data.user.role === "instructor") {
          const coursesRes = await axios.get<Course[]>(
            `/api/courses/instructor/${username}`,
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
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-8 py-5 flex flex-col items-center justify-center min-w-[140px]">
            <img src="/points.png" alt="Points" className="w-10 h-10 mb-2" />
            <p className="uppercase tracking-wider text-xs font-bold text-gray-500">
              Points
            </p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
              {profile.points || 0}
            </p>
          </div>
        )}

        {isInstructor && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-8 py-5 flex flex-col items-center justify-center min-w-[140px]">
            <p className="uppercase tracking-wider text-xs font-bold text-gray-500">
              Courses Count
            </p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
              {profile.coursesCount || 0}
            </p>
          </div>
        )}

        {currentUser?.username !== username && (
          <Link
            to={`/chat?userId=${user.id}`}
            className="group font-semibold px-8 py-5 rounded-xl shadow-sm text-center bg-white border border-gray-200 text-gray-800 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            style={{ minWidth: "180px" }}
          >
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
                <FontAwesomeIcon
                  icon={faMessage}
                  className="w-5 h-5 text-gray-500"
                />
              </span>
              <p className="uppercase tracking-wider text-xs text-gray-500">
                Chat
              </p>
              <p className="text-xl mt-1 font-bold">Message User</p>
            </div>
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
                                src="/points.png"
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
