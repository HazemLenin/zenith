import React, { useState } from "react";
import Btn from "../../components/Button/Button";
import "./NeededSkills.css";

type Skill = {
  id: number;
  skillId: number;
  studentId: number;
  type: "learned" | "needed";
  updatedAt: string;
  name?: string;
};

type Props = {
  skills: Skill[] | undefined;
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
};

const NeededSkills: React.FC<Props> = ({ skills = [], setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (input.trim()) {
      setSkills((prev) => [
        ...prev,
        {
          id: prev.length,
          skillId: prev.length,
          studentId: 0,
          type: "needed",
          updatedAt: new Date().toISOString(),
          name: input.trim(),
        },
      ]);
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
            {skill.name || `Skill ${skill.skillId}`}{" "}
            <button onClick={() => removeSkill(idx)}>❌</button>
          </li>
        )) || null}
      </ul>
    </div>
  );
};

export default NeededSkills;