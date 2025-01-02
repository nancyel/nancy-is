import React, { useState } from "react";

import "../styles/capture.css";

const CaptureForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    text: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await fetch("/api/create-file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File created successfully!");
        window.location.href = "/";
      } else {
        alert("Error creating file");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Text:
        <textarea
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          required
        ></textarea>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CaptureForm;
