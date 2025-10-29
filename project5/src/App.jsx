import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("harry potter");

  const [filterYear, setFilterYear] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const res = await fetch(`https://openlibrary.org/search.json?q=${search}`);
      const data = await res.json();
      setBooks(data.docs.slice(0, 50)); 
      setLoading(false);
    };
    fetchBooks();
  }, [search]);

  const uniqueYears = [
    ...new Set(books.map((b) => b.first_publish_year).filter(Boolean)),
  ].sort((a, b) => b - a);

  const filteredBooks = books.filter((b) =>
    filterYear === "all" ? true : b.first_publish_year === Number(filterYear)
  );

  const totalBooks = books.length;
  const avgYear =
    books.length > 0
      ? Math.round(
          books
            .map((b) => b.first_publish_year || 0)
            .filter((y) => y > 0)
            .reduce((a, b) => a + b, 0) / books.filter((b) => b.first_publish_year).length
        )
      : "N/A";
  const topAuthor =
    books.length > 0
      ? books
          .flatMap((b) => b.author_name ||[])
          .reduce((acc, author) => {
            acc[author] = (acc[author] ||0)+1;
            return acc;
          }, {})
      : {};

  const mostCommonAuthor =
    Object.entries(topAuthor).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="App">
      <h1>Find your books</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search for books..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">All Years</option>
          {uniqueYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <p>Total Books: {totalBooks}</p>
        <p>Average Publish Year: {avgYear}</p>
        <p>Most Common Author: {mostCommonAuthor}</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="book-list">
          {filteredBooks.map((book, index) => (
            <div key={index} className="book-card">
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong>{" "}
                {book.author_name ? book.author_name.join(", "):"Unknown"}
              </p>
              <p>
                <strong>Year:</strong> {book.first_publish_year||"N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
