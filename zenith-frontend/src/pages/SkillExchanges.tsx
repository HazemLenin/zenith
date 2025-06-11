import { useEffect, useState, useContext } from "react";
import { Dropdown, Button } from "../components";
import { Card } from "../components";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function SkillExchange() {
  const [value, setValue] = useState("a");
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      studentFirstName: "Liam",
      studentLastName: "Johnson",
      sessions: 12,
      completedSessions: 10,
      points: 85,
      paid: 500,
    },
    {
      id: 2,
      studentFirstName: "Ava",
      studentLastName: "Smith",
      sessions: 8,
      completedSessions: 8,
      points: 92,
      paid: 400,
    },
    {
      id: 3,
      studentFirstName: "Noah",
      studentLastName: "Brown",
      sessions: 15,
      completedSessions: 13,
      points: 110,
      paid: 700,
    },
    {
      id: 4,
      studentFirstName: "Emma",
      studentLastName: "Davis",
      sessions: 9,
      completedSessions: 7,
      points: 70,
      paid: 350,
    },
    {
      id: 5,
      studentFirstName: "Sophia",
      studentLastName: "Wilson",
      sessions: 10,
      completedSessions: 9,
      points: 88,
      paid: 450,
    },
  ]);
  const { userToken } = useContext(UserContext);

  const handleFilterChange = (newValue: string) => {
    setValue(newValue);
    console.log("Selected value:", newValue);
  };

  async function fetchData() {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:3000/api/skill-transfers/my-skill-transfers",
        data: {
          type: value,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      setData(response.data);
      console.log("Fetched data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  useEffect(() => {
    // This effect runs when the component mounts or when 'value' changes
    //  htttp://localhost:3000/api/skill-transfers/my-skill-transfers
    fetchData();

    console.log("Component mounted or value changed:", value);
  }, []);

  return (
    <>
      <Dropdown
        options={[
          { label: "Teaching", value: "needed" },
          { label: "Learning", value: "learned" },
        ]}
        value={value}
        onChange={handleFilterChange}
      />
      <div className="grid grid-cols-1 gap-4">
        {data.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col justify-center pr-4">
              <h3 className="text-base font-bold text-gray-900">
                {item.studentFirstName} {item.studentLastName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Sessions: {item.completedSessions}/{item.sessions}
              </p>
              <p className="text-sm text-gray-500">Points: {item.points}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-[#2a5c8a]">
                ${item.paid}
              </span>
            </div>
            <Button>Exchange</Button>
          </Card>
        ))}
      </div>
    </>
  );
}

export default SkillExchange;
