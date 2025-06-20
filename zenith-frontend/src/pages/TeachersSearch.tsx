import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Card, Button, Modal } from "../components";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
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
  const { showToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TeacherResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTeacher, setModalTeacher] = useState<TeacherResult | null>(null);
  const [requestedTeachers, setRequestedTeachers] = useState<Set<number>>(
    new Set()
  );

  // Fetch needed skills for the current user
  useEffect(() => {
    const fetchSkills = async () => {
      if (!currentUser?.username) return;
      try {
        const res = await axios.get(`/api/users/${currentUser.username}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
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
        `/api/skill-transfers/teachers-search?skillId=${selectedSkill}`,
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
        "/api/skill-transfers/request",
        {
          skillId: Number(selectedSkill),
          teacherId: modalTeacher.teacherId,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      // Add the teacher to the requested set
      setRequestedTeachers(
        (prev) => new Set([...prev, modalTeacher.teacherId])
      );
      showToast("Skill request sent successfully!", "success");
    } catch {
      showToast("Failed to send skill request.", "error");
    }
  };

  // Handle modal cancellation
  const handleModalNo = () => {
    setModalOpen(false);
  };

  return (
    <div className="px-2 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Zenith</h1>
        <div>
          <Link
            to="/skill-transfers/my-requests"
            className="text-primary hover:underline font-medium mr-4"
          >
            My Requests
          </Link>
          <Link
            to="/skill-transfers"
            className="text-primary hover:underline font-medium"
          >
            Active Transfers
          </Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:flex-1">
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
        <div className="w-full sm:w-40">
          <Button
            onClick={handleSearch}
            disabled={!selectedSkill || loading}
            isLoading={loading}
            loadingText="Searching..."
            ariaLabel={
              loading ? "Searching for teachers..." : "Search for teachers"
            }
          >
            Search
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {searchResults.length === 0 && (
          <div className="text-center text-gray-400 text-lg py-8">
            Please select a skill and click search to see available teachers
          </div>
        )}
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
                  disabled={requestedTeachers.has(teacher.teacherId)}
                >
                  {requestedTeachers.has(teacher.teacherId)
                    ? "Requested"
                    : "Request"}
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
    </div>
  );
};

export default TeachersSearch;
