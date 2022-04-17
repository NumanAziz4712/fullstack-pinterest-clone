import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Feed, Navbar, Search, PinDetail, CreatePin } from '../components';

const Pins = ({ user }) => {
  const [search, setSearch] = useState('');

  return (
    <div className=' relative'>
      <Navbar search={search} setSearch={setSearch} user={user} />

      <div className='h-full md:px-5 px-2'>
        <Routes>
          <Route
            path='/'
            element={<Feed search={search} setSearch={setSearch} />}
          />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route
            path='/pin-detail/:pinId'
            element={<PinDetail user={user} />}
          />
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          <Route
            to='/search'
            element={<Search search={search} setSearch={setSearch} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
