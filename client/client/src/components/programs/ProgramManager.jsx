// /src/components/programs/ProgramManager.jsx

import React, { useState, useEffect } from "react";
import ProgramList from "./ProgramList";
import AddProgram from "./AddProgram";

const ProgramManager = () => {
  const [reload, setReload] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const triggerReload = () => {
    console.log("🔄 Triggering reload...");
    setReload(prev => !prev);
  };

  const handleEdit = (program) => {
    console.log("✏️ Editing program:", program.name || program.title);
    setSelectedProgram(program);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    console.log("❌ Canceling edit");
    setSelectedProgram(null);
    setEditMode(false);
  };

  const handleSave = () => {
    console.log("💾 Program saved, triggering reload");
    triggerReload();
    setEditMode(false);
    setSelectedProgram(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            🎓 Programs Management
          </h2>
          <p className="text-gray-600">
            Manage your educational programs: French, Coding, Chess, Robotics, English, and Reading
          </p>
        </div>

        <AddProgram
          onSaved={handleSave}
          editMode={editMode}
          selectedProgram={selectedProgram}
          onCancel={handleCancelEdit}
        />

        <hr className="my-8 border-gray-300" />

        <ProgramList
          reload={reload}
          onEdit={handleEdit}
          onDelete={triggerReload}
        />
      </div>
    </div>
  );
};

export default ProgramManager;
