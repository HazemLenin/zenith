import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components';
import Card from '../components/Card/Card';
import Toast from "../components/Toast/Toast";
export default function Requests() {
    interface Request {
        studentFirstname: string;
        studentLastname: string;
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

useEffect(() => {
    const defaultRequests = [
        {
            studentFirstname: "John",
            studentLastname: "Doe",
            skillId: 1,
            skillTitle: "React Development",
            skillPoints: 100
        },
        {
            studentFirstname: "Sarah",
            studentLastname: "Smith",
            skillId: 2,
            skillTitle: "TypeScript",
            skillPoints: 75
        },
        {
            studentFirstname: "Michael",
            studentLastname: "Johnson",
            skillId: 3,
            skillTitle: "Node.js",
            skillPoints: 85
        }
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
            const response = await axios.get('/skill-transfers/my-requests');
            const data = Array.isArray(response.data) ? response.data : [];
            setRequests(data.length > 0 ? data : defaultRequests);
            console.log(data)
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests(defaultRequests); // use default values on error
        }
    };
    
    fetchRequests();
}, []);
    // Handle Reject button
    function handleReject() {
        setToast({
            isVisible: true,
            message: "Request rejected !",
            type: "error"
        });
    }
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
                {
                    requests.map((request) => (
                        <Card key={request.skillId}>
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col">
                                    <div className='font-semibold'>{request.studentFirstname} {request.studentLastname}</div>
                                    <div className="flex items-center">
                                        <span>{request.skillTitle}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        btnFun={async () => {
                                            try {
                                                await axios.put(`/skill-transfers/accept/${request.skillId}`);
                                                setRequests(requests.filter(r => r.skillId !== request.skillId));
                                            } catch (error) {
                                                console.error('Error accepting request:', error);
                                            }
                                        }} 
                                        btnName="Accept" 
                                    />
                                    <Button 
                                        btnFun={async () => {
                                            try {
                                                await axios.put(`/skill-transfers/reject/${request.skillId}`);
                                                setRequests(requests.filter(r => r.skillId !== request.skillId));
                                            } catch (error) {
                                                console.error('Error rejecting request:', error);
                                            }
                                            handleReject()
                                        }} 
                                        btnName="Reject" 
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                }
            </div>
    );
}
