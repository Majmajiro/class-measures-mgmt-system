// /src/components/programs/AddProgram.jsx

import React, { useState, useEffect } from "react";

const AddProgram = ({ onSaved, editMode, selectedProgram, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
  });

  useEffect(() => {
    if (editMode && selectedProgram) {
      setFormData(selectedProgram);
    }
  }, [editMode, selectedProgram]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `/api/programs/${selectedProgram._id}`
      : "/api/programs";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      onSaved(data);
      setFormData({ name: "", description: "", level: "" });
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Program Name"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        placeholder="Description"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="level"
        value={formData.level}
        placeholder="Level"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? "Update" : "Add"} Program
        </button>
        {editMode && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddProgram;


