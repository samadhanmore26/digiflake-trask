// Navbar.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Perform logout actions here (e.g., clear authentication token)
    // For demonstration, we'll navigate to the login page
    navigate('/'); // Use navigate instead of history.push
  };

  return (
    <nav className="bg-[#662671] p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <div className="ml-3">
            <img src="./img/Group.svg" alt="" />
          </div>
          <div>
            <img src="./img/Group1.svg" alt="" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDropdown}
            className="text-white  hover:text-gray-300 focus:outline-none mr-10"
          >
            <img className="rounded-full" src="/img/Vector.svg" alt="" />
          </button>
          {isDropdownOpen && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 h-full w-full bg-transparent"
              ></button>
              <div className="absolute right-0 mt-12 w-48 bg-white border rounded shadow-md">
                <button
                  className="block text-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
