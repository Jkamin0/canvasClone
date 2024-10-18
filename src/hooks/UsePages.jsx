import { useState, useEffect } from "react";
import { useApi } from "../api/apiV3";
import { useNavigate } from "react-router-dom";

export default function usePages() {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({
    title: "",
    pageType: "home",
    content: "",
    moduleId: "0",
  });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pagesApi = useApi("pages");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const existingPages = await pagesApi.getAll();
        setPages(existingPages);
      } catch (err) {
        setError("Failed to load pages.");
      }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePageClick = (pageId) => {
    navigate(`/pages/${pageId}`);
  };

  return {
    pages,
    newPage,
    error,
    isModalOpen,
    handleInputChange,
    handleSubmit,
    handleCloseModal,
    handlePageClick,
    setIsModalOpen,
  };
}
