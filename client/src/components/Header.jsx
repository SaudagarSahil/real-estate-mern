import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200">
      <div className="flex justify-between items-center p-3 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
            <span className="text-slate-800">Rental</span>
            <span className="text-blue-500">System</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white border border-gray-300 rounded-full shadow-md w-full max-w-2xl px-4 py-2"
        >
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            className="w-full text-gray-900 focus:outline-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="hidden"></button>
        </form>

        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          <Link
            to="/"
            className="hidden sm:inline-block hover:text-blue-500 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hidden sm:inline-block hover:text-blue-500 transition duration-200"
          >
            About
          </Link>
          <Link to="/profile" className="flex items-center">
            {currentUser ? (
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition duration-200"
                src={currentUser.avatar}
                alt="Profile-Pic"
              />
            ) : (
              <span className="hover:text-blue-500 transition duration-200">
                Sign In
              </span>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
