import React, { useEffect, useState, useContext } from "react";
import { Button } from "../components";
import { Spinner } from "../components";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface Session {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  paid: boolean;
}

interface SkillTransferDetails {
  skillTitle: string;
  teacherFirstName: string;
  teacherLastName: string;
  teacherUsername: string;
  studentFirstName: string;
  studentLastName: string;
  studentUsername: string;
  points: number;
  paid: number;
  sessionsCount: number;
  completedSessionsCount: number;
  sessions: Session[];
}

const SkillTransferDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userToken } = useContext(UserContext);
  const { showToast } = useToast();
  const [details, setDetails] = useState<SkillTransferDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    open: boolean;
    action: null | "pay" | "complete";
    sessionId: number | null;
  }>({ open: false, action: null, sessionId: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/skill-transfers/transfer-details/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => setDetails(res.data))
      .catch(() => showToast("Failed to fetch details", "error"))
      .finally(() => setLoading(false));
  }, [id, showToast, userToken]);

  const isStudent = currentUser?.username === details?.studentUsername;
  const isTeacher = currentUser?.username === details?.teacherUsername;

  const handleAction = async () => {
    if (!id || modal.sessionId === null || !details) return;
    setActionLoading(true);

    const actionUrl =
      modal.action === "pay"
        ? `http://localhost:3000/api/skill-transfers/${id}/pay-session/${modal.sessionId}`
        : `http://localhost:3000/api/skill-transfers/${id}/complete-session/${modal.sessionId}`;

    const successMessage =
      modal.action === "pay"
        ? "Session marked as paid"
        : "Session marked as completed";

    axios
      .put(
        actionUrl,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      )
      .then(() => {
        showToast(successMessage, "success");
        return axios.get(
          `http://localhost:3000/api/skill-transfers/transfer-details/${id}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
      })
      .then((res) => {
        setDetails(res.data);
      })
      .catch((error) => {
        showToast(error?.response?.data?.message || "Action failed", "error");
      })
      .finally(() => {
        setActionLoading(false);
        setModal({ open: false, action: null, sessionId: null });
      });
  };

  if (loading || !details) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 md:mb-4">
        Exchange Details
      </h1>
      {/* Modern Glassmorphism Card */}
      <div className="relative max-w-3xl mx-auto mb-10">
        <div className="absolute inset-0 rounded-3xl bg-blue-100 blur-lg opacity-30" />
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-200 p-8 sm:p-12 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-xl text-gray-800">
                Skill:
              </span>
              <span className="text-xl text-gray-900">
                {details.skillTitle}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-xl text-gray-800">
                Teacher:
              </span>
              <Link
                to={`/users/${details.teacherUsername}`}
                className="font-semibold text-primary ml-2 hover:underline transition-all"
              >
                {details.teacherFirstName} {details.teacherLastName}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-xl text-gray-800">
                Student:
              </span>
              <Link
                to={`/users/${details.studentUsername}`}
                className="font-semibold text-primary ml-2 hover:underline transition-all"
              >
                {details.studentFirstName} {details.studentLastName}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-xl text-gray-800">
                Points:
              </span>
              <span className="flex items-center gap-3 text-xl text-gray-900">
                {details.points}
                <img src="/points.png" alt="Points" className="w-8 h-8" />
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-xl text-gray-800">
                Sessions:
              </span>
              <span className="text-xl text-gray-900">
                {details.completedSessionsCount}/{details.sessionsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Modern Table */}
      <div className="overflow-x-auto rounded-3xl shadow-lg bg-white/90 backdrop-blur-lg border border-blue-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Session Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Completed
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {details.sessions.map((s, idx) => (
              <tr key={s.id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                <td className="px-6 py-4">{s.title}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    {s.points}
                    <img src="/points.png" alt="points" className="w-5 h-5" />
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      s.paid
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s.paid ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      s.completed
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s.completed ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {isStudent && !s.paid && s.completed && (
                      <Button
                        variant="primary"
                        className="rounded-full px-5 py-2 text-sm font-bold bg-blue-500 text-white shadow hover:bg-blue-600 transition"
                        onClick={() =>
                          setModal({
                            open: true,
                            action: "pay",
                            sessionId: s.id,
                          })
                        }
                      >
                        <span className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCoins} />
                          Pay
                        </span>
                      </Button>
                    )}
                    {isTeacher && !s.completed && (
                      <Button
                        variant="primary"
                        className="rounded-full px-5 py-2 text-sm font-bold bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                        onClick={() =>
                          setModal({
                            open: true,
                            action: "complete",
                            sessionId: s.id,
                          })
                        }
                      >
                        <span className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Complete
                        </span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title="Confirmation"
        open={modal.open}
        onClose={() => setModal({ open: false, action: null, sessionId: null })}
        footer={
          <div className="flex gap-4 w-full">
            <Button
              variant="primary"
              onClick={handleAction}
              isLoading={actionLoading}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setModal({ open: false, action: null, sessionId: null })
              }
            >
              No
            </Button>
          </div>
        }
      >
        Are you sure?
      </Modal>
    </div>
  );
};

export default SkillTransferDetailsPage;
