import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BigLogo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the menu visibility
  const navigate =useNavigate()
  const moveAnnotate = () => {
   navigate('/label')
  };

  const moveBill = () => {
    console.log('Move to Billing');
  };
  const moveToTable=()=>{
    navigate('/table')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-white relative mb-2 h-16 z-10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={BigLogo} className="h-10 md:h-full" alt="Logo" />
          </a>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div
            className={`${
              isMenuOpen ? 'absolute top-14 left-0 w-full  md:text-normal' : 'hidden'
            } md:relative md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* <li className=' hover:bg-gray-100 p-2 rounded-md'>
                <p
                  className="block py-2 px-3 text-orange-600 text-2xl hover:cursor-pointer rounded md:bg-transparent md:text-normal md:p-0 dark:text-white "
                  aria-current="page"
                  onClick={moveAnnotate}
                >
                  Annotate
                </p>
              </li> */}
              <li className='hover:bg-gray-100  p-2 rounded-md'>
              <p
                  className="block py-2 px-3 text-orange-600 text-2xl hover:cursor-pointer rounded md:bg-transparent md:text-normal md:p-0 dark:text-white "
                  aria-current="page"
                  onClick={moveBill}
                >
                  Bill
                </p>
              </li>
              <li className='hover:bg-gray-100 md:text-xl   p-2 rounded-md'>
              <p
                  className="block py-2 px-3 text-orange-600 text-2xl hover:cursor-pointer rounded md:bg-transparent md:text-normal md:p-0 dark:text-white "
                  aria-current="page"
                  onClick={moveToTable}
                >
                  Table
                </p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <hr/>
    </>
  );
};

export default Header;
