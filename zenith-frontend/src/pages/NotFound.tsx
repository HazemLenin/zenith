import React from "react";
import NeededSkills from "./SkillsUpdate/NeededSkills";
import SkillModal from "./SkillsUpdate/SkillModal";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist
          </p>
        </div>
      </main>
      <NeededSkills />
      <SkillModal />
    </div>
  );
};

