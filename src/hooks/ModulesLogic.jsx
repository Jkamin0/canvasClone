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
  const [errorMessage, setErrorMessage] = useState("");

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
    setAssignedPages((prevAssignedPages) => {
      const isPageAssigned = prevAssignedPages.some(
        (page) => page.id === pageId
      );

      if (isPageAssigned) {
        return prevAssignedPages.filter((page) => page.id !== pageId);
      } else {
        const pageToAdd = pages.find((page) => page.id === pageId);
        return [...prevAssignedPages, pageToAdd];
      }
    });
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

    const updatedModules = modules
      .map((mod) =>
        mod.id === currentModule.id
          ? updatedModule
          : mod.orderID >= newOrderID
          ? { ...mod, orderID: mod.orderID + 1 }
          : mod
      )
      .sort((a, b) => a.orderID - b.orderID);

    const updateModules = [
      modulesApi.update(currentModule.id, updatedModule),
      ...updatedModules.map((mod) => modulesApi.update(mod.id, mod)),
    ];

    const updatePages = pages.map((page) => {
      const isPageAssigned = assignedPages.some((p) => p.id === page.id);
      const moduleId = isPageAssigned
        ? currentModule.id
        : page.moduleId === currentModule.id
        ? 0
        : page.moduleId;

      return pagesApi.update(page.id, { ...page, moduleId });
    });

    // Perform all updates
    await Promise.all([...updateModules, ...updatePages]);

    setPages(await pagesApi.getAll());
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
