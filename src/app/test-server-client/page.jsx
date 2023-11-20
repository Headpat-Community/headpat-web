import Client from "./page.client";

export const fetchData = async (searchParams) => {
  // Create the URL based on the search parameters
  const apiUrl = `https://jsonplaceholder.typicode.com/todos/${searchParams}`;

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);

    // Parse the JSON response
    const data = await response.json();
    console.log('Data fetched:', data);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function TestPage({ searchParams }) {
  const data = fetchData(searchParams);
  console.log(searchParams)

  return (
    <>
      <Client data={data} />
    </>
  );
}
