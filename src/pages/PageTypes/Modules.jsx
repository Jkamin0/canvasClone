import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import TextInput from "../../components/common/TextInput";
import NumberInput from "../../components/common/NumberInput";
import SubmitButton from "../../components/common/SubmitButton";
import useModules from "../../hooks/ModulesLogic";

const ModulesPage = () => {
  const {
    modules,
    pages,
    isCreateModalOpen,
    setCreateModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    currentModule,
    newModuleName,
    setNewModuleName,
    newOrderID,
    assignedPages,
    handleCreateModule,
    openEditModal,
    handlePageChange,
    handleOrderChange,
    handleSaveChanges,
    handlePublishChange,
    handleDeleteModule,
    user,
    errorMessage,
  } = useModules();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      {/* Create button */}
      {user?.isTeacher && (
        <SubmitButton onClick={() => setCreateModalOpen(true)}>
          Create Module
        </SubmitButton>
      )}

      {modules
        .filter((module) => user?.isTeacher || module.published) // Only show published to students
        .sort((a, b) => a.orderID - b.orderID) // Modules are displayed in order
        .map((module) => (
          <Accordion key={module.id}>
            <AccordionSummary>
              <Typography>{module.name}</Typography>
              {/* Edit Button */}
              {user?.isTeacher && (
                <Button onClick={() => openEditModal(module)}>Edit</Button>
              )}
            </AccordionSummary>
            <AccordionDetails>
              {pages
                .filter((page) => page.moduleId === module.id)
                .map((page) => (
                  <div key={page.id} style={{ marginBottom: "16px" }}>
                    <Typography variant="h6">{page.title}</Typography>
                    <Typography variant="subtitle1">{`Type: ${page.pageType}`}</Typography>
                    <Typography>{page.content}</Typography>
                  </div>
                ))}

              {/* Published checkbox */}
              {user?.isTeacher && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={module.published}
                      onChange={() => handlePublishChange(module.id)}
                    />
                  }
                  label="Published"
                />
              )}
              {/* Delete button for teachers */}
              {user?.isTeacher && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteModule(module.id)}
                >
                  Delete Module
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

      {/* Create Module Modal */}
      <Modal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">Create New Module</h3>
          <p className="text-red-500">{errorMessage}</p>
          <TextInput
            label="Module Name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateModule}
          >
            Create Module
          </Button>
        </div>
      </Modal>

      {/* Edit Module Modal */}
      <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-16">
          <h3 className="text-xl font-semibold mb-4">
            Edit Module: {currentModule?.name}
          </h3>
          <TextInput
            label="Module Name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            required
          />
          <NumberInput
            label="Order ID"
            type="number"
            value={newOrderID}
            onChange={handleOrderChange}
            required
          />
          {pages.map((page) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={assignedPages.some((p) => p.id === page.id)}
                  onChange={() => handlePageChange(page.id)}
                />
              }
              label={page.title}
              key={page.id}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ModulesPage;
