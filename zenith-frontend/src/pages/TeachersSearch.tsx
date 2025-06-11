import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Card, Button, Modal, Toast } from "../components";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";

interface Skill {
  id: number;
  title: string;
  type: string;
  description: string;
  points: number;
}

interface TeacherResult {
  teacherId: number;
  points: number;
  teacherFirstName: string;
  teacherLastName: string;
  description: string;
}

const TeachersSearch: React.FC = () => {
  const { currentUser, userToken } = useContext(UserContext);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TeacherResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTeacher, setModalTeacher] = useState<TeacherResult | null>(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  // Fetch needed skills for the current user
  useEffect(() => {
    const fetchSkills = async () => {
      if (!currentUser?.username) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/${currentUser.username}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const neededSkills = res.data.profile.skills.filter(
          (s: Skill) => s.type === "needed"
        );
        setSkills(neededSkills);
      } catch {
        setSkills([]);
      }
    };
    fetchSkills();
  }, [currentUser, userToken]);

  // Search for teachers with the selected skill
  const handleSearch = async () => {
    if (!selectedSkill) return;
    setLoading(true);
    try {
      const res = await axios.get<TeacherResult[]>(
        `http://localhost:3000/api/skill-transfers/teachers-search?skillId=${selectedSkill}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle request button click
  const handleRequest = (teacher: TeacherResult) => {
    setModalTeacher(teacher);
    setModalOpen(true);
  };

  // Handle modal confirmation
  const handleModalYes = async () => {
    if (!modalTeacher || !selectedSkill) return;
    setModalOpen(false);
    try {
      await axios.post(
        "http://localhost:3000/api/skill-transfers/request",
        {
          skillId: Number(selectedSkill),
          teacherId: modalTeacher.teacherId,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setToast({
        isVisible: true,
        message: "Skill request sent successfully!",
        type: "success",
      });
    } catch {
      setToast({
        isVisible: true,
        message: "Failed to send skill request.",
        type: "error",
      });
    }
  };

  // Handle modal cancellation
  const handleModalNo = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Zenith</h1>
        <div>
          <Link
            to="/skill-transfers/my-requests"
            className="text-primary hover:underline font-medium"
          >
            My Requests
          </Link>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Dropdown
            options={skills.map((s) => ({
              label: s.title,
              value: s.id.toString(),
            }))}
            value={selectedSkill}
            onChange={setSelectedSkill}
            placeholder="Needed Skill"
          />
        </div>
        <div className="w-40">
          <Button onClick={handleSearch} disabled={!selectedSkill || loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {searchResults.map((teacher) => (
          <Card
            key={teacher.teacherId}
            className="p-4 border border-gray-200 rounded-lg shadow-none hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">
                  {teacher.teacherFirstName} {teacher.teacherLastName}
                </span>
                <span className="text-gray-500 text-sm">
                  Points: {teacher.points}
                </span>
              </div>
              <div className="w-32 flex-shrink-0">
                <Button
                  onClick={() => handleRequest(teacher)}
                  className="w-full"
                >
                  Request
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title="Skill Request"
        open={modalOpen}
        onClose={handleModalNo}
        footer={
          <>
            <Button onClick={handleModalYes} className="mr-2" shape="default">
              Yes
            </Button>
            <Button onClick={handleModalNo} variant="secondary" shape="default">
              No
            </Button>
          </>
        }
      >
        <div className="py-4">
          <div className="mb-2 font-semibold">Skill Description</div>
          <div className="text-gray-700">
            {skills.find((s) => s.id.toString() === selectedSkill)
              ?.description || "No description available."}
          </div>
        </div>
      </Modal>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </div>
  );
};

export default TeachersSearch;
