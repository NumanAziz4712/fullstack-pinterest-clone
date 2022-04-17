import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useState, useEffect } from 'react';

const getStorageItem = () => {
  let theme = '';
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme');
  }
  return theme;
};

const Navbar = ({ search, setSearch, user }) => {
  const [theme, setTheme] = useState(getStorageItem());

  const toggleTheme = () => {
    if (!theme) {
      setTheme('dark');
    } else {
      setTheme('');
    }
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const navigate = useNavigate();

  if (!user) return null;
  return (
    <div className=' sticky z-10 right-0 bg-white dark:bg-black   top-0  md:px-5 px-2'>
      <div className='flex gap-2 md:gap-5  w-full py-5'>
        <div className='flex justify-start items-center w-full px-2 rounded-full py-1 border dark:border-gray-600 border-gray-100 dark:caret-red-500 dark:bg-gray-900   dark:text-gray-300 bg-white outline-none focus-within:shadow-sm'>
          <IoMdSearch fontSize={21} className='ml-1 text-gray-400' />
          <input
            type='text'
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search'
            value={search}
            // onFocus={() => navigate('/search')}
            className='p-2 w-full dark:bg-gray-900 bg-white outline-none'
          />
        </div>

        <div className='flex flex-none  gap-3'>
          <button
            className='h-12 w-12 flex items-center transition-all duration-200 justify-center rounded-full dark:bg-gray-900 dark:hover:bg-gray-800  bg-gray-50'
            onClick={() => toggleTheme()}
          >
            {!theme ? (
              <HiSun fontSize={28} />
            ) : (
              <HiMoon fontSize={28} className='text-white' />
            )}
          </button>
          <Link
            to='create-pin'
            className='bg-black dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-center text-white rounded-full h-12 w-12 '
          >
            <IoMdAdd fontSize={28} className='text-white' />
          </Link>
          <Link to={`user-profile/${user._id}`} className='hidden md:block'>
            <img
              src={user.image}
              // alt='userimage'
              className='h-12 w-12  rounded-full'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
