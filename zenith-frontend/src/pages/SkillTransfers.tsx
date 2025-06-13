import { useEffect, useState, useContext } from "react";
import { Dropdown, Spinner } from "../components";
import { Card } from "../components";
import axios from "axios";
import { UserContext } from "../context/UserContext";

interface SkillTransfer {
  id: number;
  studentFirstName: string;
  studentLastName: string;
  teacherFirstname?: string;
  teacherLastname?: string;
  sessions: number;
  completedSessions: number;
  points: number;
  paid: number;
  status: "in_progress" | "finished";
}

function SkillTransfers() {
  const [value, setValue] = useState("needed");
  const [data, setData] = useState<SkillTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useContext(UserContext);

  const inProgressTransfers = data.filter(
    (transfer) => transfer.status === "in_progress"
  );
  const finishedTransfers = data.filter(
    (transfer) => transfer.status === "finished"
  );

  const handleFilterChange = (newValue: string) => {
    setValue(newValue);
  };

  async function fetchData() {
    setIsLoading(true);
    axios
      .get(`/api/skill-transfers/my-skill-transfers?type=${value}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, [value]);

  const renderTransferCard = (item: SkillTransfer) => (
    <Card
      key={item.id}
      className="bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex flex-col md:flex-row w-full gap-6 md:gap-0">
        {/* Left column */}
        <div className="flex-1 flex flex-col justify-center pr-0 md:pr-8">
          <div className="font-bold text-lg text-primary mb-2 text-center md:text-left">
            {value === "needed" ? (
              <>
                Learning from: {item.teacherFirstname} {item.teacherLastname}
              </>
            ) : (
              <>
                Teaching: {item.studentFirstName} {item.studentLastName}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Total Sessions:</span>{" "}
              {item.sessions}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Completed Sessions:</span>{" "}
              {item.completedSessions}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    item.sessions
                      ? (item.completedSessions / item.sessions) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-4 w-2/3 mx-auto md:mx-0" />

          <div className="flex flex-col items-center md:items-start mt-2">
            <div className="text-xs text-gray-500 font-semibold mb-1">
              Points Earned
            </div>
            <span className="flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full text-base shadow-sm">
              {item.points}
              <img className="w-6 h-6 ml-2" src="/points.png" alt="points" />
            </span>
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-px bg-gray-200 mx-6" />

        {/* Right column */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 w-full md:w-64 bg-gray-50 md:bg-transparent rounded-xl p-4 md:p-0 gap-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Payment Status</div>
            <div className="text-2xl font-bold text-[#2a5c8a] flex items-center justify-center">
              {item.paid}
              <img className="w-6 h-6 ml-2" src="/points.png" alt="points" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {item.paid > 0 ? "Paid" : "Unpaid"}
            </div>
          </div>
          <a
            href={`/skill-transfers/${item.id}`}
            className="transition-transform duration-150 hover:scale-105 w-full md:w-40 bg-primary text-white font-semibold py-3 px-3 rounded-lg flex items-center justify-center text-center shadow hover:bg-primary-active"
          >
            View Details
          </a>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-black">Skill Transfers</h1>
      <div className="max-w-md mx-auto">
        <Dropdown
          options={[
            { label: "Learning", value: "needed" },
            { label: "Teaching", value: "learned" },
          ]}
          value={value}
          onChange={handleFilterChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center">No skill transfers found</p>
      ) : (
        <div className="flex flex-col gap-8">
          {/* In Progress Section */}
          {inProgressTransfers.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                In Progress
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {inProgressTransfers.map(renderTransferCard)}
              </div>
            </div>
          )}

          {/* Finished Section */}
          {finishedTransfers.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Completed
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {finishedTransfers.map(renderTransferCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SkillTransfers;
