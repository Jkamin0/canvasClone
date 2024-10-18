import React, { useEffect, useState } from "react";
import { useApi } from "../../api/apiV3";

export default function HomePage() {
  const [homePage, setHomePage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pagesApi = useApi("pages");

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        setError(null);
        const page = await pagesApi.getByField("pageType", "home");
        setHomePage(page);
      } catch (err) {
        setError("Failed to load the home page content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {error && <div className="text-red-500">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : homePage ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{homePage.title}</h1>
          <div className="text-gray-700">{homePage.content}</div>
        </>
      ) : (
        <div className="text-gray-500">
          No home page content is available. Have your professor navigate to All
          Pages to create one.
        </div>
      )}
    </div>
  );
}
