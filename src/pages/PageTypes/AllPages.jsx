import React from "react";
import usePages from "../../hooks/UsePages";
import TextInput from "../../components/common/TextInput";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SubmitButton from "../../components/common/SubmitButton";

export default function AllPages() {
  const {
    pages,
    newPage,
    error,
    isModalOpen,
    handleInputChange,
    handleSubmit,
    handleCloseModal,
    handlePageClick,
    setIsModalOpen,
  } = usePages();

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
            className="bg-white shadow rounded-lg p-4 mb-4 w-full max-w-lg mx-auto cursor-pointer"
            onClick={() => handlePageClick(page.id)}
          >
            <h5 className="text-xl font-bold">{page.title}</h5>
            <p className="text-gray-700">{page.content}</p>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">Create New Page</h3>
          {error && <div className="text-red-500 mb-4">{error}</div>}
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
