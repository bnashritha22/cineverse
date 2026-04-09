import { useEffect, useState } from "react";

function Home() {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [query, setQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const API_KEY = "0174c69010f787882a48faa008d030d0";

  useEffect(() => {
    fetchPopular();
    fetchWatchlist();
  }, []);

  const fetchPopular = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await res.json();
    setMovies(data.results);
  };

  const fetchByGenre = async (id) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`
    );
    const data = await res.json();
    setMovies(data.results);
  };

  const searchMovies = async () => {
    if (!query) {
      fetchPopular(); // 🏠 reset
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    const data = await res.json();
    setMovies(data.results);
  };

  const fetchWatchlist = async () => {
    const res = await fetch(`http://localhost:5000/watchlist/${user.id}`);
    const data = await res.json();
    setWatchlist(data);
  };

  const addToWatchlist = async (movie) => {
    await fetch("http://localhost:5000/watchlist", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userId: user.id,
        movie: {
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        },
      }),
    });

    fetchWatchlist();
  };

  const removeFromWatchlist = async (id) => {
    await fetch("http://localhost:5000/watchlist", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userId: user.id,
        movieId: id,
      }),
    });

    fetchWatchlist();
  };

  const getLang = (code) => {
    return {
      en: "English",
      hi: "Hindi",
      ko: "Korean",
      ja: "Japanese",
    }[code] || code;
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-red-500 font-bold tracking-wide">
          CineVerse 🎬
        </h1>

        <div className="flex gap-3 items-center">

          {/* HOME BUTTON */}
          <button onClick={fetchPopular} className="icon-btn">
            🏠
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="btn"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex gap-3">
        <input
          placeholder="Search movies..."
          className="p-3 text-black rounded-lg w-72"
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={searchMovies} className="btn">
          Search
        </button>
      </div>

      {/* GENRES */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
          { id: 18, name: "Drama" },
          { id: 27, name: "Horror" },
          { id: 10749, name: "Romance" },
          { id: 53, name: "Thriller" },
          { id: 16, name: "Animation" },
          { id: 80, name: "Crime" },
        ].map((g) => (
          <button key={g.id} onClick={() => fetchByGenre(g.id)} className="chip">
            {g.name}
          </button>
        ))}
      </div>

      {/* MOVIES */}
      <div className="grid grid-cols-5 gap-5">
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className="movie-card"
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt=""
              className="rounded-lg"
            />
            <p className="mt-2 text-sm">{m.title}</p>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="modal">
          <div className="modal-content">

            <h2 className="text-2xl">{selected.title}</h2>
            <p className="mt-2 text-sm text-gray-300">{selected.overview}</p>

            <p className="mt-2">⭐ {selected.vote_average}</p>
            <p>🌍 {getLang(selected.original_language)}</p>

            <div className="mt-3 flex gap-2">
              <button onClick={() => addToWatchlist(selected)} className="btn">
                Add ❤️
              </button>

              <button onClick={() => removeFromWatchlist(selected.id)} className="btn">
                Remove ❌
              </button>
            </div>

            <button onClick={() => setSelected(null)} className="close-btn">
              Close
            </button>

          </div>
        </div>
      )}

      {/* WATCHLIST */}
      <h2 className="mt-10 text-xl">Your Watchlist</h2>

      <div className="grid grid-cols-5 gap-5 mt-3">
        {watchlist.map((m) => (
          <div key={m.movieId} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster}`}
              alt=""
              className="rounded-lg"
            />
            <p className="mt-2 text-sm">{m.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;