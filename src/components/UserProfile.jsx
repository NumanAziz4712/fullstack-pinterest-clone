import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { MdNotificationsActive } from 'react-icons/md';
const randomImage =
  'https://source.unsplash.com/1600x500/?nature,photography,technology';
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  console.log(text);
  // active btn styles
  const activeBtnStyles =
    'bg-red-500 text-white transition-all duration-200 font-bold p-2 rounded-full w-20 outline-none';
  const notActiveBtnStyles =
    'bg-primary mr-4 dark:text-gray-400 text-black font-bold p-2  transition-all duration-200 rounded-full w-20 outline-none';
  // useeffect
  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  // save and created post

  useEffect(() => {
    if (text === 'Created') {
      const createdPinQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => {
        setPins(data);
      });
    } else {
      const createdPinQuery = userSavedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // logout user
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };
  // check user
  if (!user) {
    return <Spinner message='Loading profile...' />;
  }
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <div className='relative w-full'>
              {/* gradient */}
              <div className='absolute w-full bg-gradient-to-b bottom-0 from-transparent to-black/80 h-[150px]'></div>
              <img
                src={randomImage}
                alt='banner'
                className='w-full h-[200px] md:h-[300px] 2xl:h-510  object-cover'
              />
            </div>

            <img
              src={user.image}
              className='rounded-full sm:w-28 h-20 w-20 sm:h-28  -translate-y-1/2 ring-4 ring-white object-cover shadow-lg'
              alt='user-image'
            />

            <h1 className='font-bold -mt-8 text-xl sm:text-2xl text-center  '>
              {user.userName}
            </h1>
            <div className='absolute top-4 z-1 right-4'>
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <button
                      type='button'
                      className='bg-white active:translate-y-0 px-3 py-1.5 flex hover:-translate-y-[2px] transition-all duration-200 items-center rounded-full cursor-pointer  outline-none shadow-md'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout
                        color='red'
                        fontSize={21}
                        className='md:mr-2'
                      />{' '}
                      <p className='font-semibold text-gray-600 hidden md:inline-flex'>
                        Logout
                      </p>
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy='single_host_origin'
                />
              )}
            </div>
          </div>

          {/* buttons */}
          <div className='text-center mt-4 mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={` ${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('save');
              }}
              className={` ${
                activeBtn === 'save' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {/* show pins  */}
          <div className='px-2'>
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className='flex justify-center font-bold items-center w-full text-xl mt-3'>
                No pins found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
