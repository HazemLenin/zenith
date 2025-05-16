import React, { useState } from "react";
import "./SkillModal.css";

type Skill = {
  skillId: number;
  type: "learned" | "needed";
  points: number;
  description: string;
};

type SkillModalProps = {
  onAddSkill: (skill: Skill) => void;
};

const SkillModal: React.FC<SkillModalProps> = ({ onAddSkill }) => {
  const [showModal, setShowModal] = useState(false);
  const [skillId, setSkillId] = useState(1);
  const [points, setPoints] = useState(0);
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!description.trim() || points < 0) {
      alert("Please fill in all required fields and ensure price is valid.");
      return;
    }

    onAddSkill({ skillId, type: "learned", points, description });

    setSkillId((prev) => prev + 1);
    setPoints(0);
    setDescription("");
    setShowModal(false);
  };

  const skillOptions = ["Skill 1", "Skill 2", "Skill 3"];

  return (
    <>
    
      <h3 className="learned-skills-title">Learned Skills</h3>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="add-button"
      >
        Add
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Add Learned Skill</h2>

            <div className="modal-input-group">
              <select
                className="modal-select"
                value={`Skill ${skillId}`}
                onChange={(e) => setSkillId(parseInt(e.target.value.split(" ")[1]))}
              >
                {skillOptions.map((option, index) => (
                  <option key={index + 1} value={`Skill ${index + 1}`}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                className="modal-input"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>

            <textarea
              className="modal-textarea"
              placeholder="Skill Description (text)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-ok"
                onClick={handleAdd}
              >
                OK
              </button>
              <button
                type="button"
                className="modal-btn-no"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillModal;