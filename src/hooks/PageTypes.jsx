import { useState, useEffect, useRef } from "react";
import { useApi } from "../api/apiV3";

export function PageTypes(initialTypes = []) {
  const [pageTypes, setPageTypes] = useState([]);
  const pageTypesApi = useApi("pageTypes");
  const hasInitialized = useRef(false);

  useEffect(() => {
    const fetchPageTypes = async () => {
      // Prevent default type seeding to run more than once
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      const storedPageTypes = await pageTypesApi.getAll();
      if (storedPageTypes.length > 0) {
        setPageTypes(storedPageTypes);
      } else {
        await pageTypesApi.bulkCreate(initialTypes.map((type) => ({ type })));
        setPageTypes(initialTypes.map((type) => ({ type })));
      }
    };

    fetchPageTypes();
  }, []);

  const addPageType = async (newType) => {
    if (!pageTypes.some((type) => type.type === newType)) {
      const newPageType = { type: newType };
      await pageTypesApi.create(newPageType);
      const createdPageType = await pageTypesApi.getAll();
      setPageTypes(createdPageType);
    }
  };

  return [pageTypes, addPageType];
}
