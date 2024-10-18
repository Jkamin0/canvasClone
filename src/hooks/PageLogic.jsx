import { useEffect, useState } from "react";
import { useApi } from "../api/apiV3";
import { useNavigate } from "react-router-dom";

export const PageLogic = (initialPageTypes) => {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({
    title: "",
    pageType: "home",
    content: "",
    moduleId: "0",
  });
  const [newPageType, setNewPageType] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const pagesApi = useApi("pages");
  const navigate = useNavigate();
  const [pageTypes, addPageType] = initialPageTypes;

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
      if (!newPage.title || !newPage.content) {
        throw new Error("Please fill out all fields.");
      }

      const existingHomePage = await pagesApi.getByField("pageType", "home");
      if (newPage.pageType === "home" && existingHomePage) {
        throw new Error(
          "A 'home' page already exists. Please choose a different page type."
        );
      }

      await pagesApi.create(newPage);
      setNewPage({ title: "", pageType: "home", content: "", moduleId: "0" });
      const existingPages = await pagesApi.getAll();
      setPages(existingPages);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageClick = (pageId) => {
    navigate(`/pages/${pageId}`);
  };

  const handleAddPageType = () => {
    if (newPageType && !pageTypes.includes(newPageType)) {
      addPageType(newPageType);
      setNewPageType("");
      setIsTypeModalOpen(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenTypeModal = () => setIsTypeModalOpen(true);
  const handleCloseTypeModal = () => setIsTypeModalOpen(false);

  return {
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
  };
};
