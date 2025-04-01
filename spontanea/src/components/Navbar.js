import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <Link to="/" className="text-lg font-bold">Spontanea</Link>
      <div>
        <Link to="/hangouts" className="mx-2">Hangouts</Link>
        <Link to="/events" className="mx-2">Events</Link>
        <Link to="/profile" className="mx-2">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;