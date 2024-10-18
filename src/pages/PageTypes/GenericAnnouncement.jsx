import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../api/apiV3";
import { LoginContext } from "../../context/LoginContext";
import TextInput from "../../components/common/TextInput";
import { Button } from "@mui/material";

export default function AnnouncementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const announcementsApi = useApi("announcements");
  const { user } = useContext(LoginContext);

  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await announcementsApi.getById(parseInt(id));
        if (data) {
          setAnnouncement(data);
          setUpdatedTitle(data.title);
          setUpdatedContent(data.content);
        } else {
          setError("Announcement not found.");
        }
      } catch (err) {
        setError("Failed to fetch the announcement.");
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleDelete = async () => {
    if (!announcement) return;

    try {
      await announcementsApi.delete(announcement.id);
      navigate("/announcements");
    } catch (err) {
      setError("Failed to delete the announcement.");
    }
  };

  const handleSave = async () => {
    if (!announcement) return;

    try {
      await announcementsApi.update(announcement.id, {
        ...announcement,
        title: updatedTitle,
        content: updatedContent,
      });
      setAnnouncement((prev) => ({
        ...prev,
        title: updatedTitle,
        content: updatedContent,
      }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save the announcement.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!announcement) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {isEditing ? (
        <div>
          <TextInput
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4"
            placeholder="Announcement Title"
          />
          <TextInput
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            multiline
            rows={5}
            placeholder="Announcement Content"
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              className="mr-2"
            >
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">{announcement.title}</h2>
          <p>{announcement.content}</p>
          <p className="text-sm text-gray-500 mt-2">
            Created by {announcement.createdBy} on {announcement.createdAt}
          </p>

          {user && user.isTeacher && (
            <div className="flex justify-end mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                className="mr-2"
              >
                Edit Announcement
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete Announcement
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
