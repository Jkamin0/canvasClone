import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import { useApi } from "../api/apiV3";

const useModules = () => {
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
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

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
      setErrorMessage("Module with this name already exists.");
      return;
    }
    setErrorMessage("");
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
    setNewOrderID(e.target.value);
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

  return {
    modules,
    pages,
    isCreateModalOpen,
    setCreateModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    currentModule,
    setCurrentModule,
    newModuleName,
    setNewModuleName,
    newOrderID,
    setNewOrderID,
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
  };
};

export default useModules;
