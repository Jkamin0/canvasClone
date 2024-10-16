import React, { useContext, useState } from "react";
import { LoginContext } from "../../context/LoginContext";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

export default function RegisterPage() {
  const { createUser, error, isLoading } = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [major, setMajor] = useState("");
  const [age, setAge] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(email, password, fullName, major, age, isTeacher);

    setEmail("");
    setPassword("");
    setFullName("");
    setMajor("");
    setAge("");
    setIsTeacher(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextInput
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <TextInput
          label="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
        />
        <TextInput
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isTeacher}
            onChange={(e) => setIsTeacher(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Are you a teacher?
          </label>
        </div>
        <SubmitButton isLoading={isLoading}>Create User</SubmitButton>{" "}
      </form>
    </div>
  );
}
