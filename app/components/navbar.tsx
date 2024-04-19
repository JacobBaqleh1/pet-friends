import { NavLink } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 b-b-2 b-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <NavLink
            to="/"
            className="text-white text-lg font-bold  tracking-widest"
          >
            Pet Friends
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
