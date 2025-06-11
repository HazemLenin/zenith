import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { Button } from "../components";
import { Input, Table } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Sessions: React.FC = () => {
  const { userToken } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [requestData, setRequestData] = useState({
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
  const [error, setError] = useState("");
  const totalPoints = sessions.reduce((sum, s) => sum + s.points, 0);

  useEffect(() => {
    if (!requestData.id) {
      setError("No request data provided");
      return;
    }
  }, [requestData]);

  const handleAddSession = () => {
    if (!sessionName.trim() || !sessionPoints.trim()) return;
    const points = Number(sessionPoints);
    if (isNaN(points) || points <= 0) {
      setError("Points must be a positive number");
      return;
    }
    if (totalPoints + points > requestData.skillPoints) {
      setError("Total points exceed allowed maximum");
      return;
    }
    setSessions([...sessions, { sessionTitle: sessionName, points }]);
    setSessionName("");
    setSessionPoints("");
    setError("");
  };

  const handleDeleteSession = (idx: number) => {
    setSessions(sessions.filter((_, i) => i !== idx));
  };

  const handleFinishAndStart = async () => {
    if (!requestData.id) return;
    try {
      await axios.put(
        `http://localhost:3000/api/skill-transfers/accept/${requestData.id}`,
        sessions,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      navigate("/skill-transfers/my-requests");
    } catch {
      setError("Failed to start sessions.");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-black mb-4">
        Add Sessions for {requestData.studentName}
      </h1>
      <div className="mb-4">
        <p className="text-lg">Skill: {requestData.skillTitle}</p>
        <p className="text-lg">
          Total Points Available: {requestData.skillPoints}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">
        <div className="flex flex-1">
          <Input
            type="text"
            placeholder="Session Name"
            value={sessionName}
            onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
              setSessionName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-1 items-center">
          <Input
            type="number"
            placeholder="Points"
            value={sessionPoints}
            min={1}
            max={requestData.skillPoints - totalPoints}
            onChangeFun={(e: ChangeEvent<HTMLInputElement>) =>
              setSessionPoints(e.target.value)
            }
          />
          <div className="px-4 flex items-center justify-center">
            <span className="w-20">Out Of</span>
            <span className="flex items-center">
              {requestData.skillPoints - totalPoints}
              <img className="w-8 h-8 ml-1.5" src="/points.png" />
            </span>
          </div>
        </div>
        <div className="w-48">
          <Button
            onClick={handleAddSession}
            disabled={
              !sessionName.trim() ||
              !sessionPoints.trim() ||
              totalPoints + Number(sessionPoints) > requestData.skillPoints
            }
          >
            Add
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
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
                  <img className="w-6 h-6 ml-1.5" src="/points.png" />
                </span>,
                <Button
                  key={idx}
                  variant="secondary"
                  shape="square"
                  onClick={() => handleDeleteSession(idx)}
                  className="ml-2"
                >
                  &#10005;
                </Button>,
              ]),
            ]}
          />
        )}
      </div>
      <div className="flex justify-end mt-6">
        <div className="w-48">
          <Button
            onClick={handleFinishAndStart}
            disabled={sessions.length === 0}
            className="w-full"
          >
            Finish & Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
