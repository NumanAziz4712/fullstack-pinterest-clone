import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  // comment functionality
  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetails(data[0]);

        // getting similiar pics
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  console.log(pinDetails);

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetails) return <Spinner message='Loading pin...' />;

  return (
    <>
      <div
        className='flex xl:flex-row flex-col mb-8 m-auto dark:bg-gray-900 bg-white'
        style={{ maxWidth: '1500px', borderRadius: '32px' }}
      >
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            alt=''
            className='rounded-lg'
          />
        </div>

        <div className='w-full xl:px-8 p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center  xl:mb-8 justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetails?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-8 h-8 rounded-full flex items-center justify-center border text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline />
              </a>
            </div>

            <div className='py-1 px-3 hover:bg-black group border border-gray-100 rounded-full'>
              <a
                href={pinDetails.destination}
                target='_blank'
                rel='noreferrer'
                className='flex items-center  gap-2'
              >
                <BsFillArrowUpRightCircleFill className='text-gray-500 group-hover:text-white' />
                <p className='text-sm font-bold group-hover:text-white text-gray-600 '>
                  visit
                </p>
              </a>
            </div>

            {/* text */}
          </div>
          <div>
            <h1 className='text-2xl capitalize font-bold break-words mt-3'>
              {pinDetails.title}
            </h1>
            <p className='mt-3 text-gray-600'>{pinDetails.about}</p>
          </div>

          {/* user */}
          <Link
            to={`user-profile/${pinDetails?.postedBy?._id}`}
            className='flex gap-2 mt-4 items-center'
          >
            <img
              src={pinDetails?.postedBy?.image}
              alt='user-profile'
              className='w-7 h-7 rounded-full'
            />
            <p className='text-sm font-semibold text-gray-500'>
              {' '}
              {pinDetails?.postedBy.userName}
            </p>
          </Link>
          {/* comments */}
          <h2 className='mt-5 text-xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetails?.comments?.map((comment, i) => (
              <div
                className='flex gap-3 ml-4 mt-4 items-center dark:bg-gray-900 bg-white rounded-lg'
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt='user-profile'
                  className='w-7 h-7 rounded-full cursor-pointer'
                />
                <div className='flex gap-2'>
                  <p className='font-bold dark:text-gray-100 text-sm'>
                    {comment.postedBy.userName}
                  </p>
                  <p className='text-sm dark:text-gray-400 text-gray-600'>
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* create comments */}
          <div className='flex flex-wrap mt-6 items-center gap-3 '>
            <Link to={`user-profile/${pinDetails?.postedBy?._id}`}>
              <img
                src={pinDetails?.postedBy?.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full'
              />
            </Link>

            {/* input */}
            <input
              type='text'
              className='flex-1 dark:bg-gray-800 dark:caret-red-500 border-gray-100 dark:border-gray-700 dark:focus:border-gray-600 dark:text-gray-300 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-semibold text-sm outline-none '
              onClick={addComment}
            >
              {addingComment ? 'Posting ...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {pins ? (
        <>
          <h2 className='text-center font-bold text-lg mt-8 mb-5'>
            More like this
          </h2>

          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message='Loading more pins..' />
      )}
    </>
  );
};

export default PinDetail;
