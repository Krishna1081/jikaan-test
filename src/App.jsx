import { useState, useEffect, Suspense } from "react";
import { CiStar } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [dropdownItems, setDropdownItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const url = searchQuery
          ? `https://api.jikan.moe/v4/anime?q=${searchQuery}&page=${page}`
          : `https://api.jikan.moe/v4/top/anime?page=${page}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response error: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.log("Fetching Error: ", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [page, searchQuery]);

  useEffect(() => {
    async function fetchDropdownItems() {
      if (searchQuery) {
        try {
          const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${searchQuery}`
          );
          if (!response.ok) {
            throw new Error(`Response error: ${response.status}`);
          }
          const json = await response.json();
          setDropdownItems(json.data);
        } catch (error) {
          console.log("Dropdown Fetching Error: ", error);
        }
      } else {
        setDropdownItems([]);
      }
    }
    fetchDropdownItems();
  }, [searchQuery]);

  function Loading() {
    return (
      <h2>
        <AiOutlineLoading className="loading-icon" />
        Loading...
      </h2>
    );
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
    setPage(1);
  }

  function handleLeft() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleRight() {
    setPage(page + 1);
  }

  // function handleSelectItem(item) {
  //   setSearchQuery(item.title);
  //   setDropdownItems([]);
  // }

  return (
    <div className="main">
      <h1>Anime List</h1>
      <input
        type="search"
        name="search-form"
        id="search-form"
        placeholder="Search anime..."
        className="search-input"
        value={searchQuery}
        onChange={handleSearch}
      />
      {/* {dropdownItems.length > 0 && (
        <ul className="dropdown">
          {dropdownItems.map((item) => (
            <li key={item.mal_id} onClick={() => handleSelectItem(item)}>
              {item.title}
            </li>
          ))}
        </ul>
      )} */}
      <div>
        {loading ? (
          <Loading />
        ) : data != null ? (
          <div>
            <button onClick={handleLeft} disabled={page === 1}>
              <FaArrowLeft className="arrow" /> Prev
            </button>
            {page}
            <button onClick={handleRight}>
              Next <FaArrowRight />
            </button>
            <Suspense fallback={<Loading />}>
              <ul className="grid-container">
                {data.data.map((post) => (
                  <li
                    key={post.mal_id}
                    className="card"
                    onClick={() => navigate(`/item/${post.mal_id}`)}
                  >
                    <img
                      src={post.images.jpg.image_url}
                      alt={post.title}
                      loading="lazy"
                    />
                    <p className="status">{post.status}</p>
                    <p>{post.episodes} episodes</p>
                    <p>{post.title_english || post.title}</p>
                    <p>
                      <CiStar />
                      {post.score}
                    </p>
                    <p>#{post.rank} Ranking</p>
                    <ul className="genres">
                      {post.genres.map((genre) => (
                        <li key={genre.mal_id} className="genre-name">
                          {genre.name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Suspense>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default App;
