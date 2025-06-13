import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Table, Modal } from "../components";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";

// Types from OpenAPI schema
interface SkillTransferSession {
  title: string;
  points: number;
  completed: boolean;
  paid: boolean;
}

interface SkillTransferDetail {
  skillTitle: string;
  teacherFirstName: string;
  teacherLastName: string;
  studentFirstName: string;
  studentLastName: string;
  points: number;
  paid: number;
  sessionsCount: number;
  completedSessionsCount: number;
  sessions: SkillTransferSession[];
}

export default function SkillDetails() {
  const { userToken } = useContext(UserContext);
  const { showToast } = useToast();
  // Role switching for demo; replace with real user role logic
  const { skillTransferId } = useParams<{ skillTransferId: string }>();
  const [isTeacher, setIsTeacher] = useState(true);
  const [details, setDetails] = useState<SkillTransferDetail | null>(null);
  const [modal, setModal] = useState({
    open: false,
    action: "",
    sessionIdx: -1,
  });

  // Fetch skill transfer details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `/api/skill-transfers/transfer-details/${skillTransferId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setDetails(res.data);
      } catch {
        setDetails(null);
        showToast("Failed to load details", "error");
      }
    };
    fetchDetails();
  }, [skillTransferId, userToken, showToast]);

  // Action handlers
  const handleAction = (action: "complete" | "pay", sessionIdx: number) => {
    setModal({ open: true, action, sessionIdx });
  };

  const confirmAction = async () => {
    if (!details || modal.sessionIdx === -1) return;
    const sessionId = modal.sessionIdx;
    const url =
      modal.action === "complete"
        ? `/skill-transfers/${skillTransferId}/complete-session/${sessionId}`
        : `/skill-transfers/${skillTransferId}/pay-session/${sessionId}`;
    setModal({ ...modal, open: false });
    try {
      await axios.put(`/api${url}`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      showToast("Success!", "success");
      const res = await axios.get(
        `/api/skill-transfers/transfer-details/${skillTransferId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setDetails(res.data);
    } catch {
      showToast("Action failed", "error");
    }
  };

  // Table data
  const tableData = [
    [
      "Session Name",
      "Points",
      isTeacher ? "Status" : "Completion",
      isTeacher ? "Payment" : "Pay",
      "Action",
    ],
    ...(details?.sessions?.map((session: SkillTransferSession, idx: number) => {
      // Teacher: can complete if not completed; Student: can pay if completed and not paid
      const canComplete = isTeacher && !session.completed;
      const canPay = !isTeacher && session.completed && !session.paid;
      return [
        session.title,
        session.points,
        isTeacher
          ? session.completed
            ? "Completed"
            : "Incomplete"
          : session.completed
          ? "Completed"
          : "Incomplete",
        session.paid ? "Paid" : "Not Paid",
        isTeacher ? (
          <Button
            disabled={!canComplete}
            onClick={() => handleAction("complete", idx)}
            shape="default"
          >
            {session.completed ? "Done" : "Complete"}
          </Button>
        ) : (
          <Button
            disabled={!canPay}
            onClick={() => handleAction("pay", idx)}
            shape="default"
          >
            {session.paid ? "Done" : "Pay"}
          </Button>
        ),
      ];
    }) || []),
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Zenith</h1>
        <Button variant="secondary">Logout</Button>
      </div>
      <ul className="mb-6">
        <li>Skill Name: {details?.skillTitle || "-"}</li>
        <li>
          Teacher Name: {details?.teacherFirstName} {details?.teacherLastName}
        </li>
        <li>
          Student Name: {details?.studentFirstName} {details?.studentLastName}
        </li>
        <li>Points: {details?.points}</li>
        <li>
          Completed sessions: {details?.completedSessionsCount}/
          {details?.sessionsCount}
        </li>
      </ul>
      <Button
        onClick={() => setIsTeacher((t) => !t)}
        variant="secondary"
        className="mb-4"
      >
        Switch to {isTeacher ? "Student" : "Teacher"}
      </Button>
      <Table data={tableData} />
      <Modal
        title="Confirmation"
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        footer={
          <>
            <Button onClick={confirmAction} className="mr-2" shape="default">
              Yes
            </Button>
            <Button
              onClick={() => setModal({ ...modal, open: false })}
              variant="secondary"
              shape="default"
            >
              No
            </Button>
          </>
        }
      >
        <div className="py-4">Are you sure?</div>
      </Modal>
    </div>
  );
}
