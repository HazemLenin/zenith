import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown/Dropdown";
import { Button } from "../components";
import Card from "../components/Card/Card";

// just test skills options 
const skillOptions = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "HTML", value: "HTML" },
    { label: "CSS", value: "CSS" },
    { label: "React", value: "React" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "Node.js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "C++", value: "C++" },
    { label: "SQL", value: "SQL" }
];
// just test teachers' offers 
const teachersOffers= [
        {
            teacherId: 1,
            points: 450,
            teacherFirstName: "Youssef",
            teacherLastName: "Magdy",
            description: "string"
        },
        {
            teacherId: 2,
            points: 250,
            teacherFirstName: "Hazem",
            teacherLastName: "Lenin",
            description: "string"
        },
        {
            teacherId: 3,
            points: 300,
            teacherFirstName: "Ahmed",
            teacherLastName: "Wael",
            description: "string"
        },
        {
            teacherId: 4,
            points: 500,
            teacherFirstName: "Sarah",
            teacherLastName: "Johnson",
            description: "string"
        },
        {
            teacherId: 5,
            points: 380,
            teacherFirstName: "Michael",
            teacherLastName: "Chen",
            description: "string"
        },
        {
            teacherId: 6,
            points: 420,
            teacherFirstName: "Emma",
            teacherLastName: "Davis",
            description: "string"
        },
        {
            teacherId: 7,
            points: 290,
            teacherFirstName: "Omar",
            teacherLastName: "Hassan",
            description: "string"
        }
    ];
    export default function Search() {
    const [selectedSkill, setSelectedSkill] = useState("");
    // show specific skill offers after choose skill
    useEffect(() => {
        alert(selectedSkill)
    },[selectedSkill])
    return (
        <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 lg:gap-4 md:gap-3 sm:gap-2">
            <Dropdown
            placeholder="Search for skills ..."
            value={selectedSkill}
            onChange={setSelectedSkill}
            options={skillOptions}
            />
            <Button btnName="Search"/>
        </div>
        <div>
            {
            teachersOffers.map(offer => (
                <Card>
                <div key={offer.teacherId} className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <div>{offer.teacherFirstName} {offer.teacherLastName}</div>
                    <div className="flex items-center">Total Points :
                        <span className="flex items-center pl-2">{offer.points}<img className="w-8 h-8 ml-1.5" src="/points.png"/></span>
                    </div>
                </div>
                <div className="rightSide"><Button btnName="Request"/></div>
                </div>
                </Card>
            ))
            }
        </div>
        </div>
    );
}