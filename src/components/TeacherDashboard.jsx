import { useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path if needed

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const addStudent = async () => {
    if (!newStudent.name || !newStudent.email) return;
    const { data, error } = await supabase
      .from("students")
      .insert([newStudent]);
    if (!error) {
      setStudents([...students, data[0]]);
      setNewStudent({ name: "", email: "" });
    } else {
      alert("Error adding student: " + error.message);
    }
  };

  return (
    <div>
      {/* ...existing dashboard code... */}
      <h2>My Students</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id}>{s.name} ({s.email})</li>
        ))}
      </ul>
      <input
        name="name"
        value={newStudent.name}
        onChange={handleInputChange}
        placeholder="Student Name"
      />
      <input
        name="email"
        value={newStudent.email}
        onChange={handleInputChange}
        placeholder="Student Email"
      />
      <button onClick={addStudent}>Add Student</button>
      {/* ...existing dashboard code... */}
    </div>
  );
}

export default TeacherDashboard;