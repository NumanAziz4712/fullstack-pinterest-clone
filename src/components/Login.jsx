import React from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import logo from '../assets/logo.JPG';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  // responseGoogle
  const responseGoogle = (response) => {
    localStorage.setItem('user', JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;
    // console.log(response.profileObj);

    // adding the user doc to sanity
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='h-full w-full relative'>
        <video
          // src={shareVideo}
          src='https://ak.picdn.net/shutterstock/videos/1058628376/preview/stock-footage-people-in-the-park-happy-family-silhouette-walk-at-sunset-mom-dad-and-daughters-walk-holding.mp4'
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay={true}
          className='w-full h-full object-cover'
        />
        <div className=' absolute  inset-0 px-10 bg-black/60'>
          <div className=' rounded-md flex mt-32 mx-auto flex-col justify-center items-center w-full sm:max-w-sm px-10 py-12  backdrop-blur-md border-gray-300/20 border '>
            <div className=' mb-8 flex flex-col items-center justify-center'>
              <img
                src={logo}
                className='rounded-full mb-6  h-12 w-12'
                width='130px'
                alt='logo'
              />

              <h2 className='text-gray-200 text-2xl font-bold'>
                Discover The World!
              </h2>
            </div>

            {/* loging button */}

            <div className='shadow-2xl w-full'>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <button
                    type='button'
                    className='bg-gray-50 hover:bg-white  flex w-full font-semibold cursor-pointer items-center justify-center p-3 rounded'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className='mr-4' /> Sign in with Google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy='single_host_origin'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
