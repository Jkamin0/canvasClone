import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api/apiV3";
import { LoginContext } from "../../context/LoginContext";
import Modal from "@mui/material/Modal";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

export default function AllAnnouncements() {
  const { user } = useContext(LoginContext);
  const announcementsApi = useApi("announcements");
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementsApi.getAll();
        setAnnouncements(data);
      } catch (err) {
        setError("Failed to fetch announcements.");
      }
    };
    fetchAnnouncements();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newAnnouncement = {
        // Set ID manually, otherwise console error about
        //  a missing Key for unique elements being rendered
        id: Date.now(),
        title,
        content,
        createdBy: user ? user.fullName : "Unknown",
        // Save the date as a localized string
        createdAt: new Date().toLocaleString(),
      };
      await announcementsApi.create(newAnnouncement);
      setAnnouncements([...announcements, newAnnouncement]);
      handleCloseModal();
    } catch (err) {
      setError("Failed to save the announcement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementClick = (id) => {
    navigate(`/announcements/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <SubmitButton onClick={handleOpenModal}>Create Announcement</SubmitButton>
      <ul>
        {announcements.toReversed().map((announcement) => (
          <li
            key={announcement.id}
            className="border-b py-2 cursor-pointer"
            onClick={() => handleAnnouncementClick(announcement.id)}
          >
            <h3 className="font-semibold">{announcement.title}</h3>
            <p>{announcement.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created by {announcement.createdBy} on {announcement.createdAt}
            </p>
          </li>
        ))}
      </ul>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">New Announcement</h3>
          <form onSubmit={handleSaveAnnouncement}>
            <TextInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextInput
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              multiline
              rows={4}
            />
            <SubmitButton type="submit" className="mt-4">
              {isLoading ? "Saving..." : "Save Announcement"}
            </SubmitButton>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
