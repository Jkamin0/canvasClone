import React, { useEffect, useState, useContext } from "react";
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
import { useApi } from "../../api/apiV3";
import { LoginContext } from "../../context/LoginContext";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";

const ModulesPage = () => {
  const modulesApi = useApi("modules");
  const pagesApi = useApi("pages");
  const { user } = useContext(LoginContext);
  const [modules, setModules] = useState([]);
  const [pages, setPages] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [newModuleName, setNewModuleName] = useState("");
  const [newOrderID, setNewOrderID] = useState("");
  const [assignedPages, setAssignedPages] = useState([]);

  // Fetch modules and pages
  useEffect(() => {
    const fetchModules = async () => {
      const modulesData = await modulesApi.getAll();
      setModules(modulesData);
    };

    const fetchPages = async () => {
      const pagesData = await pagesApi.getAll();
      setPages(pagesData);
    };

    fetchModules();
    fetchPages();
  }, []);

  const handleCreateModule = async () => {
    const existingModule = modules.find(
      (module) => module.name === newModuleName
    );
    if (existingModule) {
      alert("Module with this name already exists");
      return;
    }
    await modulesApi.create({
      name: newModuleName,
      published: false,
      orderID: modules.length,
    });
    setNewModuleName("");
    setCreateModalOpen(false);
    setModules(await modulesApi.getAll());
  };

  const openEditModal = (module) => {
    setCurrentModule(module);
    setAssignedPages(pages.filter((page) => page.moduleId === module.id));
    setNewModuleName(module.name);
    setNewOrderID(module.orderID);
    setEditModalOpen(true);
  };

  const handlePageChange = (pageId) => {
    setAssignedPages((prev) =>
      prev.some((page) => page.id === pageId)
        ? prev.filter((page) => page.id !== pageId)
        : [...prev, pages.find((page) => page.id === pageId)]
    );
  };

  const handleOrderChange = (e) => {
    setNewOrderID(Number(e.target.value));
  };

  const handleSaveChanges = async () => {
    const updatedModule = {
      ...currentModule,
      name: newModuleName,
      orderID: newOrderID,
    };

    // Adjust the orderIDs
    const updatedModules = modules.map((mod) => {
      if (mod.id === currentModule.id) return updatedModule;
      if (mod.orderID >= newOrderID && mod.id !== currentModule.id) {
        return { ...mod, orderID: mod.orderID + 1 };
      }
      return mod;
    });

    updatedModules.sort((a, b) => a.orderID - b.orderID);

    await modulesApi.update(currentModule.id, updatedModule);

    await Promise.all(
      updatedModules.map((mod) => modulesApi.update(mod.id, mod))
    );

    // Page assignments
    const updatedPages = pages.map((page) => {
      const isAssigned = assignedPages.some((p) => p.id === page.id);
      if (isAssigned) {
        return { ...page, moduleId: currentModule.id };
      } else if (page.moduleId === currentModule.id) {
        return { ...page, moduleId: 0 };
      }
      return page;
    });

    await Promise.all(
      updatedPages.map(async (page) => {
        await pagesApi.update(page.id, page);
      })
    );

    setPages(updatedPages);
    setModules(await modulesApi.getAll());
    setEditModalOpen(false);
  };

  const handlePublishChange = async (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    await modulesApi.update(moduleId, {
      ...module,
      published: !module.published,
    });
    setModules(await modulesApi.getAll());
  };

  const handleDeleteModule = async (moduleId) => {
    await modulesApi.delete(moduleId);
    setModules(await modulesApi.getAll());
  };

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
          <TextInput
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
