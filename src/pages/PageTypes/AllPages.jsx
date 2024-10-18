import React from "react";
import { useContext } from "react";
import TextInput from "../../components/common/TextInput";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SubmitButton from "../../components/common/SubmitButton";
import { PageTypes } from "../../hooks/PageTypes";
import { PageLogic } from "../../hooks/PageLogic";
import { LoginContext } from "../../context/LoginContext";

export default function AllPages() {
  const { user } = useContext(LoginContext);
  const pageTypesHook = PageTypes(["home", "generic", "assignment", "inClass"]);
  const {
    pages,
    newPage,
    newPageType,
    error,
    pageTypes,
    isModalOpen,
    isTypeModalOpen,
    handleInputChange,
    handleSubmit,
    handlePageClick,
    handleAddPageType,
    handleOpenModal,
    handleCloseModal,
    handleOpenTypeModal,
    handleCloseTypeModal,
    setNewPageType,
  } = PageLogic(pageTypesHook);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {error && <div className="text-red-500">{error}</div>}
      <h2 className="text-2xl font-bold mb-4">All Pages</h2>

      {user?.isTeacher && (
        <>
          <SubmitButton onClick={() => handleOpenModal()}>
            Create New Page
          </SubmitButton>
          <SubmitButton color="secondary" onClick={() => handleOpenTypeModal()}>
            Add New Page Type
          </SubmitButton>
        </>
      )}

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

      {/* Add new page */}
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
                {pageTypes.map((type) => (
                  <MenuItem key={type.id} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
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

      {/* Create new page type */}
      <Modal open={isTypeModalOpen} onClose={handleCloseTypeModal}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">Add New Page Type</h3>
          <TextInput
            label="New Page Type"
            value={newPageType}
            onChange={(e) => setNewPageType(e.target.value)}
            required
          />
          <div className="flex space-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPageType}
            >
              Add Page Type
            </Button>
            <Button
              onClick={handleCloseTypeModal}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
