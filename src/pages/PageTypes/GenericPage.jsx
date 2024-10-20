import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../api/apiV3";
import TextInput from "../../components/common/TextInput";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LoginContext } from "../../context/LoginContext";

export default function GenericPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(LoginContext);
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [pageTypes, setPageTypes] = useState([]);
  const pagesApi = useApi("pages");
  const pageTypesApi = useApi("pageTypes");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      const fetchedPage = await pagesApi.getById(id);
      setPage(fetchedPage);
    };

    const fetchPageTypes = async () => {
      const storedPageTypes = await pageTypesApi.getAll();
      setPageTypes(storedPageTypes);
    };

    fetchPage();
    fetchPageTypes();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      if (!page.title || !page.content) {
        throw new Error("Please fill out all fields.");
      }

      // Check if a "home" page already exists using the API
      const existingHomePage = await pagesApi.getByField("pageType", "home");
      if (
        page.pageType === "home" &&
        existingHomePage &&
        existingHomePage.id !== id
      ) {
        throw new Error(
          "A 'home' page already exists. Please choose a different page type."
        );
      }

      await pagesApi.update(id, page);
      navigate("/pages");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await pagesApi.delete(id);
      navigate("/pages");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      {page && (
        <>
          <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {user && !user.isTeacher ? (
            <div>{page.content}</div>
          ) : (
            <>
              <TextInput
                label="Title"
                name="title"
                value={page.title}
                onChange={handleInputChange}
                required
              />
              <FormControl fullWidth required className="mb-4">
                <InputLabel id="pageType-label">Page Type</InputLabel>
                <Select
                  labelId="pageType-label"
                  id="pageType"
                  name="pageType"
                  value={page.pageType}
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
                value={page.content}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
              />
              <div className="flex space-x-4 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDelete}
                >
                  Delete Page
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
