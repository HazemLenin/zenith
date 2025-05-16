import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../components/CourseCard/CourseCard";
import { UserContext } from "../context/UserContext";

interface Skill {
  skillId: number;
  type: "learned" | "needed";
  points: number;
  description: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
  price?: number;
}

interface Profile {
  id: number;
  skills: Skill[];
  points: number;
  courses?: Course[];
  dob?: string;
  nationality?: string;
  address?: string;
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

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<UserData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(UserContext);
  useEffect(() => {
    if (!username) return;
    setLoading(true);

    axios
      .get<UserData>(`http://localhost:3000/api/users/${username}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setSkills(res.data.profile.skills || []);
      })
      .catch(() => {
        setData(null);
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, [username]);

  const updateAllSkills = async (updatedSkills: Skill[]) => {
    if (!data) return;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/skills/students/${data.user.id}/skills`,
        { skills: updatedSkills },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setSkills(res.data);
    } catch {
      alert("Failed to update skills");
    }
  };

  const addSkill = (type: "learned" | "needed") => {
    const newSkill: Skill = {
      skillId: Date.now(),
      type,
      points: 10,
      description: "New Skill",
    };
    const updatedSkills = [...skills, newSkill];
    updateAllSkills(updatedSkills);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>User not found</div>;
  }

  const { user, profile } = data;
  const fullName = `${user.firstName || "Unknown"} ${user.lastName || ""}`;
  const isStudent = user.role === "student";
  const isInstructor = user.role === "instructor";

  return (
    <div
      className="flex-1 p-6"
      style={{
        background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        className="max-w-4xl mx-auto rounded-2xl shadow-xl p-8"
        style={{ background: "#fff" }}
      >
        <div
          className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-8 gap-6"
          style={{ borderColor: "#e0e7ef" }}
        >
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #2a5c8a 60%, #64b5f6 100%)",
                boxShadow: "0 4px 16px #e3f2fd55",
              }}
            >
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
            <div
              className="font-semibold px-8 py-5 rounded-xl shadow text-center"
              style={{
                minWidth: 140,
                background:
                  "linear-gradient(135deg, #2a5c8a 60%, #64b5f6 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px #e3f2fd55",
              }}
            >
              <p className="uppercase tracking-wider text-xs">Points</p>
              <p className="text-3xl mt-1">{profile.points || 0}</p>
            </div>
          )}

          {isInstructor && (
            <div
              className="font-semibold px-8 py-5 rounded-xl shadow text-center"
              style={{
                minWidth: 140,
                background:
                  "linear-gradient(135deg, #ff9800 60%, #ffd180 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px #ffe0b255",
              }}
            >
              <p className="uppercase tracking-wider text-xs">Courses Count</p>
              <p className="text-3xl mt-1">{profile.courses?.length || 0}</p>
            </div>
          )}
        </div>

        {isStudent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {["learned", "needed"].map((type) => (
              <div
                key={type}
                className="bg-gradient-to-br from-[#e3f2fd] to-[#f8fafc] p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {type === "learned" ? "Learned Skills" : " Needed Skills "}
                  </h3>
                  <button
                    onClick={() => addSkill(type as "learned" | "needed")}
                    className="bg-[#ff9800] hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm shadow"
                  >
                    + Add
                  </button>
                </div>
                <ul className="space-y-3">
                  {skills.filter((s) => s.type === type).length > 0 ? (
                    skills
                      .filter((skill) => skill.type === type)
                      .map((skill) => (
                        <li
                          key={skill.skillId}
                          className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm"
                        >
                          <span className="text-gray-800 font-medium">
                            {skill.description}
                          </span>
                          {type === "learned" && (
                            <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {skill.points} pts
                            </span>
                          )}
                        </li>
                      ))
                  ) : (
                    <p className="text-gray-400 italic">No skills added yet.</p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {isInstructor && (
          <section>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#ff9800" }}
            >
              Courses
            </h2>
            {profile.courses && profile.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.courses.map((course, idx) => (
                  <CourseCard key={idx} course={course} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#94adc4" }}>No courses available.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;
