import React, { useState } from "react";
import Btn from "../../components/Button/Button";
import "./NeededSkills.css";

type Props = {
  skills: string[] | undefined; 
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
};

const NeededSkills: React.FC<Props> = ({ skills = [], setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (input.trim()) {
      setSkills((prev) => [...prev, input.trim()]);
      setInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="needed-skills-container">
      <h2 className="needed-skills-title">Needed Skills</h2>
      <div className="needed-skills-input-group">
        <input
          className="needed-skills-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skill name"
        />
        <Btn btnName="✓" btnFun={addSkill} />
      </div>
      <ul className="needed-skills-list">
        {skills?.map((skill, idx) => ( 
          <li key={idx}>
            {skill} <button onClick={() => removeSkill(idx)}>❌</button>
          </li>
        )) || null} 
      </ul>
    </div>
  );
};

export default NeededSkills;