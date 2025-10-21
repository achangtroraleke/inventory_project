import {Link} from 'react-router'
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

import { MdClose, MdMenu } from "react-icons/md";

// --------------------------------------------------


const Navbar = () => {
    // State for toggling the mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Auth context to handle login status and actions
    const { authToken, logoutUser, user } = useContext(AuthContext);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Common Tailwind classes for nav links
    const linkClasses = "cursor-pointer block rounded-md px-3 py-2 text-sm font-medium transition duration-150 ease-in-out";
    const baseText = "text-gray-300 hover:bg-white/10 hover:text-white";
    const loggedInUser = user?.username || 'User'; // Safely access username

    // Helper component for Navigation Links (Desktop and Mobile)
    const NavLinks = () => (
        <>
            <Link to="/main" className={`${linkClasses} ${baseText}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to='/products' className={`${linkClasses} ${baseText}`} onClick={() => setIsMenuOpen(false)}>Products</Link>
            {/* <Link to="/transaction" className={`${linkClasses} ${baseText}`} onClick={() => setIsMenuOpen(false)}>Transactions</Link> */}
        </>
    );

    return (
        <nav className="bg-gray-800/80 shadow-lg sticky top-0 z-100 font-sans backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link id='logo' to={'/'} className="shrink-0 flex items-center space-x-2">
                            <img 
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" 
                                alt="Inventory Logo" 
                                className="size-8" 
                            />
                            <span className="text-xl font-bold text-white hidden sm:block">Inventory Pro</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className="hidden lg:flex lg:ml-6 lg:space-x-4 items-center">
                        {authToken ? (
                            <>
                                <NavLinks />
                                <div className="ml-4 flex items-center space-x-2">
                                    <span className="text-sm font-medium text-indigo-300 mr-2 hidden sm:block">Hello, {loggedInUser}</span>
                                    <button 
                                        className={`${linkClasses} bg-indigo-600 text-white hover:bg-indigo-700`} 
                                        onClick={logoutUser}
                                    > 
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="ml-4 flex items-center space-x-2">
                            <Link to='/login' className={`${linkClasses} ${baseText}  bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                Login
                            </Link>
                            <Link to={'/register'} className={`${linkClasses} text-sm font-medium text-indigo-300 mr-2 hidden sm:block`} > 
                                Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button (Visible only on Mobile) */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="cursor-pointer inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <MdClose className="block h-6 w-6" />
                            ) : (
                                <MdMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Content (Toggled by Button) */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2 ">
                    {authToken ? (
                        <>
                            <div className="px-3 py-2 text-sm font-medium text-indigo-300 border-b border-gray-700/50">
                                Logged in as: {loggedInUser}
                            </div>
                            <NavLinks />
                            <button 
                                className={`${linkClasses} w-full text-left text-red-400 hover:bg-red-900/50`} 
                                onClick={() => { logoutUser(); setIsMenuOpen(false); }}
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <div>
                        <Link 
                            to='/login' 
                            className={`${linkClasses}  text-white hover:bg-indigo-700`} 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link 
                            to='/register' 
                            className={`${linkClasses}  text-white hover:bg-indigo-700`} 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register
                        </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
