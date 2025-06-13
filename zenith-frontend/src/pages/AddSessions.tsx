import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { Button } from "../components";
import { Input, Table } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddSessions: React.FC = () => {
  const { userToken } = useContext(UserContext);
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [requestData] = useState({
    id: searchParams.get("id") || "",
    studentName: searchParams.get("studentName") || "",
    skillTitle: searchParams.get("skillTitle") || "",
    skillPoints: parseInt(searchParams.get("skillPoints") || "0"),
  });

  const [sessionName, setSessionName] = useState("");
  const [sessionPoints, setSessionPoints] = useState("");
  const [sessions, setSessions] = useState<
    { sessionTitle: string; points: number }[]
  >([]);
  const totalPoints = sessions.reduce((sum, s) => sum + s.points, 0);

  useEffect(() => {
    if (!requestData.id) {
      showToast("No request data provided", "error");
      return;
    }
  }, [requestData, showToast]);

  const handleAddSession = () => {
    if (!sessionName.trim() || !sessionPoints.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }
    const points = Number(sessionPoints);
    if (isNaN(points) || points < 0) {
      showToast("Points must be a non-negative number", "error");
      return;
    }
    if (totalPoints + points > requestData.skillPoints) {
      showToast("Total points exceed allowed maximum", "error");
      return;
    }
    setSessions([...sessions, { sessionTitle: sessionName, points }]);
    setSessionName("");
    setSessionPoints("");
    showToast("Session added successfully", "success");
  };

  const handleDeleteSession = (idx: number) => {
    setSessions(sessions.filter((_, i) => i !== idx));
    showToast("Session deleted successfully", "success");
  };

  const handleFinishAndStart = async () => {
    if (!requestData.id) return;
    try {
      await axios.put(
        `/api/skill-transfers/accept/${requestData.id}`,
        sessions,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      showToast("Sessions started successfully", "success");
      navigate("/skill-transfers/my-requests");
    } catch {
      showToast("Failed to start sessions", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 md:mb-4">
        Add Sessions for {requestData.studentName}
      </h1>
      <div className="mb-2 md:mb-4">
        <p className="text-base md:text-lg">Skill: {requestData.skillTitle}</p>
        <p className="text-base md:text-lg">
          Total Points Available: {requestData.skillPoints}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">
        <div className="flex flex-1 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Session Name"
            value={sessionName}
            onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
              setSessionName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-1 items-center w-full md:w-auto">
          <Input
            type="number"
            placeholder="Points"
            value={sessionPoints}
            min={0}
            max={requestData.skillPoints - totalPoints}
            onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
              setSessionPoints(e.target.value)
            }
          />
          <div className="px-2 md:px-4 flex items-center justify-center">
            <span className="w-16 md:w-20 text-sm md:text-base">Out Of</span>
            <span className="flex items-center">
              {requestData.skillPoints - totalPoints}
              <img className="w-5 h-5 md:w-8 md:h-8 ml-1.5" src="/points.png" />
            </span>
          </div>
        </div>
        <div className="w-full md:w-48">
          <Button
            onClick={handleAddSession}
            disabled={
              !sessionName.trim() ||
              !sessionPoints.trim() ||
              totalPoints + Number(sessionPoints) > requestData.skillPoints
            }
            className="w-full py-3"
          >
            Add
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {sessions.length > 0 && (
          <Table
            data={[
              ["#", "Session Name", "Points", ""],
              ...sessions.map((s, idx) => [
                idx + 1,
                s.sessionTitle,
                <span className="flex items-center">
                  {s.points}
                  <img
                    className="w-5 h-5 md:w-6 md:h-6 ml-1.5"
                    src="/points.png"
                  />
                </span>,
                <Button
                  key={idx}
                  variant="danger"
                  shape="square"
                  onClick={() => handleDeleteSession(idx)}
                  className="ml-2"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>,
              ]),
            ]}
          />
        )}
      </div>
      <div className="flex justify-end mt-6">
        <div className="w-full md:w-48">
          <Button
            onClick={handleFinishAndStart}
            disabled={sessions.length === 0}
            className="w-full py-3"
          >
            Finish & Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSessions;
