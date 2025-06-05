import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button } from "../components";
import Card from "../components/Card/Card";
import Toast from "../components/Toast/Toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Modal } from "../components/Modal/Modal";

export default function Requests() {
  const { userToken } = useContext(UserContext);
  const navigate = useNavigate();
  interface Request {
    studentFirstname: string;
    studentLastname: string;
    studentUsername: string;
    skillId: number;
    skillTitle: string;
    skillPoints: number;
  }
  const [requests, setRequests] = useState<Request[]>([]);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const defaultRequests = [
      {
        studentFirstname: "John",
        studentLastname: "Doe",
        studentUsername: "userName",
        skillId: 1,
        skillTitle: "React Development",
        skillPoints: 100,
      },
      {
        studentFirstname: "Sarah",
        studentLastname: "Smith",
        studentUsername: "userName",
        skillId: 2,
        skillTitle: "TypeScript",
        skillPoints: 75,
      },
      {
        studentFirstname: "Michael",
        studentLastname: "Johnson",
        studentUsername: "userName",
        skillId: 3,
        skillTitle: "Node.js",
        skillPoints: 85,
      },
    ];

    // const fetchRequests = async () => {
    //     try {
    //         const response = await axios.get('/skill-transfers/my-requests');
    //         const data =response.data;
    //         setRequests(data.length > 0 ? data : defaultRequests);
    //         console.log(data)
    //     } catch (error) {
    //         console.error('Error fetching requests:', error);
    //         setRequests(defaultRequests); // use default values on error
    //     }
    // };
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/skill-transfers/my-requests",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setRequests(data.length > 0 ? data : defaultRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests(defaultRequests); // use default values on error
      }
    };

    fetchRequests();
  }, []);
  // Handle Reject button
  async function handleRejectConfirm() {
    if (!selectedRequest) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/skill-transfers/reject/${selectedRequest.skillId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setRequests(
        requests.filter((r) => r.skillId !== selectedRequest.skillId)
      );
      setToast({
        isVisible: true,
        message: "Request rejected!",
        type: "error",
      });
    } catch {
      setToast({
        isVisible: true,
        message: "Failed to reject request.",
        type: "error",
      });
    } finally {
      setModalOpen(false);
      setSelectedRequest(null);
    }
  }

  // Handle Accept button
  const handleAccept = (request: Request) => {
    const queryParams = new URLSearchParams({
      id: request.skillId.toString(),
      studentName: `${request.studentFirstname} ${request.studentLastname}`,
      skillTitle: request.skillTitle,
      skillPoints: request.skillPoints.toString(),
    });
    navigate(`/adding-sessions?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Skills Requests</h1>
        <span className="bg-warning text-black text-sm font-medium mr-2 px-4 py-2 rounded-full shadow-md hover:bg-white transition-all duration-300 inline-flex items-center">
          {requests.length} Pending
        </span>
      </div>
      {/* test  */}
      {requests.map((request) => (
        <Card key={request.skillId}>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <Link to={`/users/${request.studentUsername}`}>
                <div className="font-semibold">
                  {request.studentFirstname} {request.studentLastname}
                </div>
              </Link>
              <div className="flex items-center">
                <span>{request.skillTitle}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAccept(request)}
                variant="primary"
                shape="default"
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setSelectedRequest(request);
                  setModalOpen(true);
                }}
                variant="primary"
                shape="default"
              >
                No
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Modal
        title="Reject Request?"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button
              onClick={handleRejectConfirm}
              variant="primary"
              shape="default"
            >
              Yes
            </Button>
            <Button
              onClick={() => setModalOpen(false)}
              variant="primary"
              shape="default"
              className="ml-2"
            >
              No
            </Button>
          </>
        }
      >
        <div>Are you sure you want to reject this skill transfer request?</div>
      </Modal>
    </div>
  );
}
