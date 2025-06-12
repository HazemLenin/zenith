import { useContext, useEffect, useState } from "react";
import { Dropdown, Card, Modal } from "../components";
import { Button } from "../components";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export default function Search() {
  // ========== STATES ==========
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const [userData, setUserData] = useState({
    user: {
      id: 0,
      firstName: "string",
      lastName: "string",
      username: "string",
      email: "string",
      role: "string",
    },
    profile: {
      id: 0,
      points: 0,
      skills: [
        {
          id: 0,
          title: "JavaScript",
          categoryId: 0,
          type: "needed",
        },
        {
          id: 1,
          title: "HTML",
          categoryId: 0,
          type: "learned",
        },
        {
          id: 2,
          title: "React",
          categoryId: 0,
          type: "needed",
        },
      ],
    },
  });
  const [teachersOffers, setTeachersOffers] = useState([
    {
      teacherId: 1,
      points: 450,
      teacherFirstName: "Youssef",
      teacherLastName: "Magdy",
      description:
        "111Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestiae voluptates repellendus beatae odit labore delectus iusto eveniet ut exercitationem!",
    },
    {
      teacherId: 2,
      points: 300,
      teacherFirstName: "Hazem",
      teacherLastName: "Lenin",
      description:
        "222Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestiae voluptates repellendus beatae odit labore delectus iusto eveniet ut exercitationem!",
    },
  ]);
  const [teacher, setTeacher] = useState({
    teacherId: 0,
    points: 0,
    teacherFirstName: "",
    teacherLastName: "",
    description: "",
  });
  // get current User from context
  const { currentUser } = useContext(UserContext);

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${currentUser?.username}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Failed to fetch user data", "error");
      }
    };

    if (currentUser?.username) {
      fetchUserData();
    }
  }, [currentUser?.username, showToast]);

  // get needed skills from userData state
  const user_skills_needed = userData?.profile?.skills
    ? userData.profile.skills
        .filter((skill) => skill.type === "needed")
        .map((skill) => ({
          label: skill.title,
          value: skill.title,
          skillId: skill.id,
        }))
    : [];

  // search function by skill Id
  async function searchFunction() {
    if (selectedSkill) {
      const skillId = user_skills_needed.find((skill) => {
        return skill.value === selectedSkill;
      })?.skillId;
      // fetch teachers' offers by skill Id
      try {
        const response = await axios.get(
          `/skill-transfers/teachers-search?skillId=${skillId}`
        );
        setTeachersOffers(response.data);
      } catch (error) {
        console.error("Error searching teachers:", error);
        showToast("Failed to search teachers", "error");
      }
    }
  }

  //request function
  function request(id?: number | string) {
    const selectedTeacher = teachersOffers.find((o) => o.teacherId === id);
    if (selectedTeacher) {
      setTeacher(selectedTeacher);
      setIsOpen(true);
    }
  }

  // Handle Yes button in Modal
  function handleYes() {
    setIsOpen(false);
    showToast("Request sent successfully!", "success");
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <Modal
        open={isOpen}
        title="Skill Reqest"
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button onClick={handleYes}>Yes</Button>
            <Button onClick={() => setIsOpen(false)}>No</Button>
          </div>
        }
      >
        <h1>{teacher.teacherFirstName}</h1>
        <p style={{ color: "#444" }}>{teacher.description}</p>
      </Modal>
      <div className="flex justify-between gap-4 lg:gap-4 md:gap-3 sm:gap-2">
        <Dropdown
          placeholder="Search for skills ..."
          value={selectedSkill}
          onChange={setSelectedSkill}
          options={user_skills_needed}
        />
        <div className="w-32">
          <Button onClick={() => searchFunction()}>Search</Button>
        </div>
      </div>
      <div>
        {teachersOffers.map((offer) => (
          <Card key={offer.teacherId}>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <div className="font-semibold">
                  {offer.teacherFirstName} {offer.teacherLastName}
                </div>
                <div className="flex items-center">
                  Total Points :
                  <span className="flex items-center pl-2">
                    {offer.points}
                    <img className="w-8 h-8 ml-1.5" src="/points.png" />
                  </span>
                </div>
              </div>
              <div className="rightSide">
                <Button onClick={() => request(offer.teacherId)}>
                  Request
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
