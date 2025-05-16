import { useContext, useEffect, useState } from "react";
import Dropdown from "../components/Dropdown/Dropdown";
import { Button } from "../components";
import Card from "../components/Card/Card";
import { Modal } from "../components/Modal/Modal";
import { UserContext } from "../context/UserContext";
import axios from "axios";
    export default function Search() {
    // ========== STATES ==========
    const [selectedSkill, setSelectedSkill] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState({
    user: {
        id: 0,
        firstName: "string",
        lastName: "string",
        username: "string",
        email: "string",
        role: "string"
    },
    profile: {
        id: 0,
        points: 0,
        skills: [
            {
                id: 0,
                title: "JavaScript",
                categoryId: 0,
                type: "needed"
            },
            {
                id: 1,
                title: "HTML",
                categoryId: 0,
                type: "learned"
            },
            {
                id: 2,
                title: "React",
                categoryId: 0,
                type: "needed"
            },
        ]
    }
});
    const [teachersOffers, setTeachersOffers] = useState(
        [
        {
            teacherId: 1,
            points: 450,
            teacherFirstName: "Youssef",
            teacherLastName: "Magdy",
            description: "111Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestiae voluptates repellendus beatae odit labore delectus iusto eveniet ut exercitationem!"
        },
        {
            teacherId: 2,
            points: 300,
            teacherFirstName: "Hazem",
            teacherLastName: "Lenin",
            description: "222Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestiae voluptates repellendus beatae odit labore delectus iusto eveniet ut exercitationem!"
        },
    ]
    );
    const [teacher,setTeacher]=useState(
        {
            teacherId: 0,
            points: 0,
            teacherFirstName: "",
            teacherLastName: "",
            description: ""
        }
    )
    // get current User from context
    const {currentUser}=useContext(UserContext)
    // fetch user data 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/users/${currentUser?.username}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        if (currentUser?.username) {
            fetchUserData();
        }
    });
    // get needed skills from userData state
    const user_skills_needed = userData.profile.skills
    .filter(skill => skill.type === "needed")
    .map((skill) => ({
        label: skill.title,
        value: skill.title,
        skillId: skill.id,
    }))
    // search function by skill Id 
    async function searchFunction (){
        if(selectedSkill){
            const skillId = user_skills_needed.find((skill)=>{
                return skill.value === selectedSkill
            })?.skillId
            // fetch teachers' offers by skill Id
            try {
                const response = await axios.get(`/skill-transfers/teachers-search?skillId=${skillId}`);
                setTeachersOffers(response.data);
                // TODO: Handle the response data as needed
            } catch (error) {
                console.error('Error searching teachers:', error);
            }
        }
    }
    //request function
    async function request(id?: number | string) {
        const selectedTeacher = teachersOffers.find(o => o.teacherId === id);
        setTeacher(selectedTeacher);
        setIsOpen(true);
    }
    return (
        <div className="flex flex-col gap-4">
            <Modal
            open={isOpen}
            title='Skill reqest'
            onClose={() => setIsOpen(false)}
            footer={<div className="flex gap-2"><Button btnName="Yes"/><Button btnFun={()=>{setIsOpen(false)}} btnName="No"/></div>}
            >
                <h1>{teacher.teacherFirstName}</h1>
                <p style={{color:'#444'}}>{teacher.description}</p>
            </Modal>
        <div className="flex justify-between gap-4 lg:gap-4 md:gap-3 sm:gap-2">
            <Dropdown
            placeholder="Search for skills ..."
            value={selectedSkill}
            onChange={setSelectedSkill}
            options={user_skills_needed}
            />
            <Button btnFun={()=>searchFunction()} btnName="Search"/>
        </div>
        <div>
            {
            teachersOffers.map((offer) => (
                <Card>
                <div key={offer.teacherId} className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <div>{offer.teacherFirstName} {offer.teacherLastName}</div>
                    <div className="flex items-center">Total Points :
                        <span className="flex items-center pl-2">{offer.points}<img className="w-8 h-8 ml-1.5" src="/points.png"/></span>
                    </div>
                </div>
                <div className="rightSide"><Button btnFun={()=>request(offer.teacherId)} btnName="Request"/></div>
                </div>
                </Card>
            ))
            }
        </div>
        </div>
    );
}