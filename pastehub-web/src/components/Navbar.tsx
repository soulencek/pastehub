import { Menu, MenuItems, MenuItem, MenuButton, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    console.log("Rendering Navbar");
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const handleSearch = () => {
        console.log("Searching...");
    };

    return (
        <nav className="flex items-center justify-between bg-white p-4 shadow-md">
            {/* Logo */}
            <div onClick={() => navigate("/")} className="flex items-center space-x-2 cursor-pointer">
                <span className="text-2xl text-indigo-600 font-bold">〰️</span>
            </div>

            {/* Search Bar */}
            <div className="relative sm:w-1/3 min-w-[100px] ml-1 mr-0.5">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <MagnifyingGlassIcon onClick={handleSearch} className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 cursor-pointer" />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        {/* New Paste Button */}
                        <button onClick={() => navigate("/create")} className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer">
                            <PlusCircleIcon className="w-6 h-6 text-white cursor-pointer" />
                            <span>New Paste</span>
                        </button>

                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center focus:outline-none cursor-pointer">
                                <UserCircleIcon className="w-10 h-10 text-gray-700" />
                            </MenuButton>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                                    <MenuItem as="button" onClick={() => navigate("/profile")} className="block w-full text-left px-4 py-2 data-[active]:bg-gray-100">
                                        Your Profile
                                    </MenuItem>
                                    <MenuItem as="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 data-[active]:bg-gray-100">
                                        Sign out
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </>
                ) : (
                    <>
                        {/* Sign In & Sign Up Buttons */}
                        <button onClick={() => navigate("/login")} className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-100">
                            Sign In
                        </button>
                        <button onClick={() => navigate("/register")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
