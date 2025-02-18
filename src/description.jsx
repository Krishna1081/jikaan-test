import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Description() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      console.error("Failed to fetch anime details:", error);
    } finally {
      setLoading(false);
    }
  }
  function Loading() {
    return (
      <h2 style={{ textAlign: "center" }}>
        <AiOutlineLoading className="loading-icon" />
        Loading...
      </h2>
    );
  }

  useEffect(() => {
    getData();
  }, [id]); // Add dependency to avoid infinite loop

  return (
    <div>
      {" "}
      {loading ? (
        <Loading />
      ) : data ? (
        <Suspense fallback={<Loading />}>
          <div className="grid-container-2">
            <div className="image-container">
              <img
                src={data.data.images.jpg.image_url}
                alt={data.data.title}
                loading="lazy"
              />
            </div>
            <div style={{ paddingLeft: "10px" }}>
              <h1>{data.data.title_english ?? data.data.title}</h1>
              <p className="status">{data.data.status}</p>
              <p>{data.data.episodes} episodes</p>
              <p>Rating: {data.data.score}/10</p>
              <p>#{data.data.rank} Ranking</p>
              <ul className="genres-2">
                {data.data.genres.map((genre) => (
                  <li key={genre.mal_id} className="genre-name">
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p>{data.data.synopsis}</p>
              <button className="btn" onClick={() => navigate("/")}>
                Go Back
              </button>
            </div>
          </div>
        </Suspense>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Description;
