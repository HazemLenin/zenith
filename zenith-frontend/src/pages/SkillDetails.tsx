import { useEffect, useState } from 'react'
import axios from 'axios'
import Btn from '../components/Button/Button'
import Table from '../components/Table/Tablel'
export default function SkillDetails() {
      // just example to change ui teacher/student to show different content in componant
    const [is_teacher,set_is_teacher]=useState<boolean>(true)
    function change(){
        set_is_teacher(!is_teacher)
    }
    // function to change complete state/id:session's id
    function changeCompletState(id?: number) {
        console.log(id)
        
    }
    // function to change pay state/id:session's id
    function changePayState(id?:number){
    console.log(id)
    }
    // fetch data 
    useEffect(()=>{
        const fetchData = async ()=>{
                const respons = await axios.get(`http://localhost:3000/skill-transfers/transfer-details/${0}`)
                console.log(respons)
        }
        fetchData()
    },[])
// just example for data that comes from the back-end
const test = {
    skillTitle: "JavaScript",
    teacherFirstName: "youssef",
    teacherLastName: "magdy",
    studentFirstName: "Hazem",
    studentLastName: "Lenin",
    points: 250,
    paid: 0,
    sessionsCount: 4,
    completedSessionsCount: 2,
    sessions: [
        {
            title: "Intro",
            points: 10,
            completed: true,
            paid: true
        },
        {
            title: "Basics",
            points: 20,
            completed: true,
            paid: false
        },
        {
            title: "Functions",
            points: 40,
            completed: false,
            paid: false
        },
        {
            title: "OOP",
            points: 180,
            completed: false,
            paid: false
        }
    ]
}

const skill_sessions = test.sessions
// what we will show as ui 
const skill_sessions_ui = skill_sessions.map((session) => {
    return [
        session.title,
        Number(session.points),
        // add string to show session is payed or not (teacher's ui) || add string to show session is completed or not (student ui)
        is_teacher ? 
        session.paid?'Paid':'Not Paid'
        : session.completed?'Completed':'Uncompleted'
        ,
        // add button to finish session (teacher's ui) || add a button to pay for session (student ui)
        is_teacher ? 
        <Btn isDisabled={session.completed? true:false} btnName={session.completed?'Done':'Complete'} btnFun={() => changeCompletState()} />
        :<Btn isDisabled={session.paid?true:false} btnName={session.paid?'Done':'Pay'} btnFun={()=> changePayState()} />
    ];
});
    return (
        <div >
        <ul>
            <li>Skill Name   : {test.skillTitle}</li>
            <li>Teacher Name : {test.teacherFirstName} {test.teacherLastName}</li>
            <li>Student Name : {test.studentFirstName} {test.studentLastName} </li>
            <li>Points : {test.points}</li>
            <li>Completed sessions : {`${test.completedSessionsCount}/${test.sessionsCount}`}</li>
        </ul>
        <Btn btnName={is_teacher? 'Swich To Student':'Swich To Teacher'}btnFun={change}/>
<Table
data={
    skill_sessions_ui
}
/>
        </div>
    )
}
