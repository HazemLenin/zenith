import { useState } from 'react'
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
        
    }
    // function to change pay state/id:session's id
    function changePayState(id?:number){
    }
// just example for data that comes from the back-end 
const skill_sessions = [
    {sessionId:3, sessionName: 'Intro', points: '10',completed:true ,paid:true },
    {sessionId:1, sessionName: 'Basics', points: '20',completed:true ,paid:false },
    {sessionId:2, sessionName: 'Functions', points: '40',completed:false ,paid:false },
    {sessionId:4, sessionName: 'OOP', points: '180',completed:false ,paid:false }
]
// what we will show as ui 
const skill_sessions_ui = skill_sessions.map((session) => {
    return [
        session.sessionName,
        Number(session.points),
        // add string to show session is payed or not (teacher's ui) || add string to show session is completed or not (student ui)
        is_teacher ? 
        session.paid?'Paid':'Not Paid'
        : session.completed?'Completed':'Uncompleted'
        ,
        // add button to finish session (teacher's ui) || add a button to pay for session (student ui)
        is_teacher ? 
        <Btn isDisabled={session.completed? true:false} btnName={session.completed?'Done':'Complete'} btnFun={() => changeCompletState(session.sessionId)} />
        :<Btn isDisabled={session.paid?true:false} btnName={session.paid?'Done':'Pay'} btnFun={()=> changePayState(session.sessionId)} />
    ];
});
    return (
        <div >
        <ul>
            <li>Skill Name : Javascript</li>
            <li>Teacher Name : Youssef Magdy</li>
            <li>Student Name : Hazem Lenin (sorry) </li>
            <li>Points : 250</li>
            <li>Sessions 2/4</li>
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
