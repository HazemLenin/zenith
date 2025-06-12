import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button } from "../components";
import { Card, Modal } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SkillTransferRequests() {
  const { userToken } = useContext(UserContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  interface Request {
    id: number;
    studentFirstname: string;
    studentLastname: string;
    studentUsername: string;
    skillId: number;
    skillTitle: string;
    skillPoints: number;
  }
  const [requests, setRequests] = useState<Request[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios
      .get(`http://localhost:3000/api/skill-transfers/my-requests`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        showToast("Failed to fetch requests", "error");
      });
  };

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
      showToast("Request rejected!", "error");
    } catch {
      showToast("Failed to reject request.", "error");
    } finally {
      setModalOpen(false);
      setSelectedRequest(null);
    }
  }

  // Handle Accept button
  const handleAccept = (request: Request) => {
    const queryParams = new URLSearchParams({
      id: request.id.toString(),
      studentName: `${request.studentFirstname} ${request.studentLastname}`,
      skillTitle: request.skillTitle,
      skillPoints: request.skillPoints.toString(),
    });
    navigate(`/adding-sessions?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between md:justify-center gap-4 w-full md:max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-black">Skills Requests</h1>
          <span className="bg-primary text-white text-sm font-medium mr-2 min-w-[80px] sm:min-w-[100px] px-6 py-2 rounded-full shadow-md inline-flex items-center justify-center text-center">
            {requests.length} Pending
          </span>
        </div>
      </div>
      {/* test  */}
      {requests.map((request) => (
        <Card
          key={request.skillId}
          className="bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row w-full gap-6 md:gap-0">
            {/* Left column */}
            <div className="flex-1 flex flex-col justify-center pr-0 md:pr-8">
              <div className="font-bold text-lg text-primary mb-2 text-center md:text-left">
                {request.studentFirstname} {request.studentLastname}
              </div>
              <div className="text-xs text-gray-500 font-semibold mb-1 text-center md:text-left">
                Skill Requested
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">
                {request.skillTitle}
              </div>
              <hr className="border-t border-gray-200 my-2 md:my-4 w-2/3 mx-auto md:mx-0" />
              <div className="flex flex-col items-center md:items-start mt-2">
                <div className="text-xs text-gray-500 font-semibold mb-1 text-center md:text-left">
                  Requested Points
                </div>
                <span className="flex items-center justify-center bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full text-base shadow-sm">
                  {request.skillPoints}
                  <img
                    className="w-6 h-6 ml-2"
                    src="/points.png"
                    alt="points"
                  />
                </span>
              </div>
            </div>
            {/* Divider for desktop */}
            <div className="hidden md:block w-px bg-gray-200 mx-6" />
            {/* Right column */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 w-full md:w-64 bg-gray-50 md:bg-transparent rounded-xl p-4 md:p-0 gap-3">
              <div className="flex flex-col gap-2 w-full md:w-40">
                <Button
                  onClick={() => handleAccept(request)}
                  variant="primary"
                  shape="default"
                  className="transition-transform duration-150 hover:scale-105 w-full flex items-center justify-center gap-2 py-2 text-base"
                >
                  <FontAwesomeIcon icon={faCheck} className="text-white" /> Yes
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRequest(request);
                    setModalOpen(true);
                  }}
                  variant="danger"
                  shape="default"
                  className="transition-transform duration-150 hover:scale-105 w-full flex items-center justify-center gap-2 py-2 text-base"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-white" /> No
                </Button>
              </div>
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
