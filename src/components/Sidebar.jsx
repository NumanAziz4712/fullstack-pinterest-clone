import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHouseDamage, FaPinterest } from 'react-icons/fa';

import { categories } from '../utils/data';

// styles
const isNotActiveStyle =
  'flex items-center px-5 hover:bg-gray-100 py-2.5 dark:hover:bg-gray-900 gap-3 dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
  'flex items-center px-5 hover:bg-gray-10 bg-red-500/30 gap-3 py-2.5 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900 font-bold border-r-2 dark:border-cyan-400 border-red-500 transition-all duration-150 ease-in-out capitalize';

// categories

const Sidebar = ({ user, closeToggle }) => {
  // handle clicn
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className='flex z-50 flex-col md:ring-1 dark:ring-gray-800/60  ring-gray-100 dark:text-gray-400 border-r-gray-100 dark:bg-black bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link
          to='/'
          className='flex px-5 gap-3 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
        >
          {/* <img src={logo} alt='logo' className=' h-10 w-10 rounded-full' /> */}
          <FaPinterest
            fontSize={30}
            className='fill-[#e20d23] bg-white rounded-full'
          />
          <p className='text-xl dark:text-gray-100  font-medium'>Pinterest</p>
        </Link>

        {/* links */}

        <div className='flex flex-col gap-5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <FaHouseDamage className='-mt-1' />
            Home
          </NavLink>
          {/* h3 */}
          <h3 className='mt-2 px-5 font-semibold text-base dark:text-gray-100 text-gray-500 2xl:text-xl'>
            Discover categories
          </h3>
          <div>
            {categories.slice(0, categories.length - 1).map((category) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                to={`/category/${category.name}`}
                onClick={handleCloseSidebar}
                key={category.name}
              >
                <img
                  src={category.image}
                  alt=''
                  className='w-8 h-8 rounded-full shadow-sm'
                />
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* user */}
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className='flex px-5 py-2.5 dark:bg-cyan-500/40 rounded-t-lg items-center bg-gray-100 mt-auto gap-3'
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className='h-10 w-10 rounded-full'
            alt='usrimage'
          />{' '}
          <p className='dark:text-white'>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
