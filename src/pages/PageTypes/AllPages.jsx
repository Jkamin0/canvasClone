import React, { useEffect, useState } from "react";
import { useApi } from "../../api/apiV3";
import TextInput from "../../components/common/TextInput";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SubmitButton from "../../components/common/SubmitButton";

export default function AllPages() {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({
    title: "",
    pageType: "home",
    content: "",
    moduleId: "",
  });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pagesApi = useApi("pages");

  useEffect(() => {
    const fetchPages = async () => {
      const existingPages = await pagesApi.getAll();
      setPages(existingPages);
    };

    fetchPages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!newPage.title || !newPage.content || !newPage.moduleId) {
        throw new Error("Please fill out all fields.");
      }

      await pagesApi.create(newPage);
      alert("Page created successfully!");

      setNewPage({
        title: "",
        pageType: "home",
        content: "",
        moduleId: "",
      });

      const existingPages = await pagesApi.getAll();
      setPages(existingPages);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {error && <div className="text-red-500">{error}</div>}
      <h2 className="text-2xl font-bold mb-4">All Pages</h2>

      <SubmitButton onClick={() => setIsModalOpen(true)}>
        Create New Page
      </SubmitButton>

      <div className="max-w-2xl mx-auto mt-8">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white shadow rounded-lg p-4 mb-4 w-full max-w-lg mx-auto"
          >
            <h5 className="text-xl font-bold">{page.title}</h5>
            <p className="text-gray-700">{page.content}</p>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">Create New Page</h3>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              name="title"
              value={newPage.title}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth required className="mb-4">
              <InputLabel id="pageType-label">Page Type</InputLabel>
              <Select
                labelId="pageType-label"
                id="pageType"
                name="pageType"
                value={newPage.pageType}
                onChange={handleInputChange}
                label="Page Type"
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="generic">Generic</MenuItem>
                <MenuItem value="assignment">Assignment</MenuItem>
                <MenuItem value="inClass">In Class</MenuItem>
              </Select>
            </FormControl>
            <TextInput
              label="Content"
              name="content"
              value={newPage.content}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />
            <TextInput
              label="Module ID"
              name="moduleId"
              value={newPage.moduleId}
              onChange={handleInputChange}
              required
            />
            <div className="flex space-x-4 mt-4">
              <Button type="submit" variant="contained" color="primary">
                Create Page
              </Button>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
