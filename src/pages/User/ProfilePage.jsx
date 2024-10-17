import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

export default function ProfilePage() {
  const { user, updateUser, isLoading, error } = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [major, setMajor] = useState("");
  const [age, setAge] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFullName(user.fullName || "");
      setMajor(user.major || "");
      setAge(user.age || "");
      setIsTeacher(user.isTeacher || false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { email, fullName, major, age, isTeacher };

    await updateUser(updatedUser);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">Profile updated successfully!</p>
      )}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </SubmitButton>
      </form>
    </div>
  );
}
