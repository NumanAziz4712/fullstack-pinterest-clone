import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';
const Pin = ({ postedBy, image, _id, destination, save }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user.googleId
  )?.length;

  // save ftn
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      // update the sanity -save array
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => window.location.reload());
      setSavingPost(false);
    }
  };

  // delete the pin
  const deletPin = (id) => {
    client.delete(id).then(() => window.location.reload());
  };

  return (
    <div className='m-2 mb-4'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in  hover:shadow-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img
          src={urlFor(image).width(250).url()}
          className='rounded-lg w-full'
          alt='user-post'
        />

        {postHovered && (
          <div
            className='absolute  top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {/* saved */}

              <button
                className='bg-red-500 hover:bg-red-600 px-3 py-1 text-white text-sm rounded-full'
                onClick={(e) => {
                  e.stopPropagation();
                  savePin(_id);
                }}
              >
                {alreadySaved ? `${save.length} Saved` : 'Save'}
              </button>
            </div>

            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold text-sm py-1  px-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-lg'
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(8, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user.googleId && (
                <button
                  className='h-8 w-8 bg-white rounded-full flex opacity-75 hover:opacity-100 items-center justify-center'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletPin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className='flex gap-2 mt-2 items-center'
      >
        <img
          src={postedBy?.image}
          alt='user-profile'
          className='w-8 h-8 rounded-full'
        />
        <p className='text-sm font-bold text-gray-600'> {postedBy.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
