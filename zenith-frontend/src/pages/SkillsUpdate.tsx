import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Table from "../components/Table/Tablel";
import { Modal } from "../components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../components/Dropdown/Dropdown";
import Toast from "../components/Toast/Toast";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

interface Skill {
  id: number;
  title: string;
}

interface UserSkill {
  id: number;
  title: string;
  type: "learned" | "needed";
  description?: string;
  points?: number;
}

// Add a local type for local skills management
interface LocalUserSkill extends UserSkill {
  skillId: number;
}

interface Profile {
  id: number;
  points?: number;
  skills?: UserSkill[];
}

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface UserData {
  user: User;
  profile: Profile;
}

const SkillsUpdate: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, userToken, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (loading) return;
    if (!currentUser || currentUser.username !== username) {
      navigate("/", { replace: true });
    }
  }, [currentUser, username, navigate, loading]);

  // State
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addLearnedForm, setAddLearnedForm] = useState({
    skillId: "",
    price: "",
    description: "",
  });
  const [addNeededSkillId, setAddNeededSkillId] = useState("");
  const [localSkills, setLocalSkills] = useState<LocalUserSkill[]>([]);
  const [unsaved, setUnsaved] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Fetch available skills and user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, userRes] = await Promise.all([
          axios.get<Skill[]>("http://localhost:3000/api/skills", {
            headers: { Authorization: `Bearer ${userToken}` },
          }),
          axios.get<UserData>(`http://localhost:3000/api/users/${username}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          }),
        ]);
        setAvailableSkills(skillsRes.data);
        setUserData(userRes.data);
        setLocalSkills(
          userRes.data.profile.skills?.map((s) => ({
            ...s,
            skillId: s.id,
          })) || []
        );
        setUnsaved(false);
      } catch {
        // handle error
      }
    };
    if (username && userToken) fetchData();
  }, [username, userToken]);

  if (loading || !userData) return <div>Loading...</div>;

  // Split skills
  const learnedSkills = localSkills.filter((s) => s.type === "learned");
  const neededSkills = localSkills.filter((s) => s.type === "needed");

  // Table data
  const learnedTableData = [
    ["Skill Name", "Price", ""],
    ...learnedSkills.map((skill) => [
      skill.title,
      skill.points ?? "-",
      <button
        key={skill.id}
        onClick={() => {
          setLocalSkills((skills) => skills.filter((s) => s.id !== skill.id));
          setUnsaved(true);
        }}
        className="text-red-500"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>,
    ]),
  ];
  const neededTableData = [
    ["Skill Name", ""],
    ...neededSkills.map((skill) => [
      skill.title,
      <button
        key={skill.id}
        onClick={() => {
          setLocalSkills((skills) => skills.filter((s) => s.id !== skill.id));
          setUnsaved(true);
        }}
        className="text-red-500"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>,
    ]),
  ];

  // Add learned skill
  const handleAddLearned = () => {
    if (!addLearnedForm.skillId) return;
    const skillMeta = availableSkills.find(
      (s) => s.id === Number(addLearnedForm.skillId)
    );
    if (!skillMeta) return;

    // Check for duplicates
    const isDuplicate = localSkills.some((s) => s.skillId === skillMeta.id);
    if (isDuplicate) {
      setToast({
        message: "This skill is already added to your profile",
        type: "error",
        isVisible: true,
      });
      return;
    }

    setLocalSkills((skills) => [
      ...skills,
      {
        id: Date.now(), // temp id for local
        title: skillMeta.title,
        type: "learned",
        points: Number(addLearnedForm.price),
        description: addLearnedForm.description,
        skillId: skillMeta.id,
      },
    ]);
    setAddLearnedForm({ skillId: "", price: "", description: "" });
    setModalOpen(false);
    setUnsaved(true);
    setToast({
      message: "Skill added successfully",
      type: "success",
      isVisible: true,
    });
  };

  // Add needed skill
  const handleAddNeeded = () => {
    if (!addNeededSkillId) return;
    const skillMeta = availableSkills.find(
      (s) => s.id === Number(addNeededSkillId)
    );
    if (!skillMeta) return;

    // Check for duplicates
    const isDuplicate = localSkills.some((s) => s.skillId === skillMeta.id);
    if (isDuplicate) {
      setToast({
        message: "This skill is already added to your profile",
        type: "error",
        isVisible: true,
      });
      return;
    }

    setLocalSkills((skills) => [
      ...skills,
      {
        id: Date.now(), // temp id for local
        title: skillMeta.title,
        type: "needed",
        skillId: skillMeta.id,
      },
    ]);
    setAddNeededSkillId("");
    setUnsaved(true);
    setToast({
      message: "Skill added successfully",
      type: "success",
      isVisible: true,
    });
  };

  // Save changes
  const handleSave = async () => {
    const payload = {
      skills: localSkills.map((s) => ({
        skillId: s.skillId,
        type: s.type,
        points: s.points ?? 0,
        description: s.description ?? "",
      })),
    };
    await axios.put(
      `http://localhost:3000/api/skills/students/${userData.profile.id}/skills`,
      payload,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    setUnsaved(false);
    navigate(`/users/${username}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
      <h2 className="text-2xl font-bold mb-8">Edit skills</h2>
      <div className="flex gap-8">
        {/* Learned Skills */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Learned Skills</span>
            <Button onClick={() => setModalOpen(true)} shape="square">
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
          <Table data={learnedTableData} />
        </div>
        {/* Needed Skills */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <span className="font-semibold text-lg">Needed Skills</span>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-full">
              <Dropdown
                options={availableSkills.map((skill) => ({
                  label: skill.title,
                  value: skill.id.toString(),
                }))}
                value={addNeededSkillId}
                onChange={setAddNeededSkillId}
                placeholder="Select skill"
              />
            </div>
            <Button onClick={handleAddNeeded} shape="square">
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
          <Table data={neededTableData} />
        </div>
      </div>
      {/* Modal for adding learned skill */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Learned Skill"
        footer={
          <>
            <Button onClick={handleAddLearned} className="mr-2">
              Yes
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="secondary">
              No
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Dropdown
            options={availableSkills.map((skill) => ({
              label: skill.title,
              value: skill.id.toString(),
            }))}
            value={addLearnedForm.skillId}
            onChange={(val) =>
              setAddLearnedForm((f) => ({ ...f, skillId: val }))
            }
            placeholder="Select skill"
          />
          <Input
            type="number"
            placeholder="Price"
            value={addLearnedForm.price}
            onChangeFun={(e) =>
              setAddLearnedForm((f) => ({ ...f, price: e.target.value }))
            }
          />
          <Input
            type="text"
            placeholder="Skill Description (text)"
            value={addLearnedForm.description}
            onChangeFun={(e) =>
              setAddLearnedForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
      </Modal>
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          className={`${
            unsaved ? "opacity-100" : "opacity-60 cursor-not-allowed"
          }`}
          disabled={!unsaved}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SkillsUpdate;
