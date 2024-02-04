import React from 'react'

function UserSearch({searchKey,setSearchKey}) {
  return (
    <div className='relative mb-2'>
        <input type='text'
        placeholder='Search users / chats'
        value={searchKey}
        className='rounded-full w-full border-gray-300 pl-10 text-gray-500'
        onChange={(e)=>setSearchKey(e.target.value)}/>
        <i className="ri-search-line absolute top-2 left-4 text-gray-500"></i>
    </div>
  )
}

export default UserSearch 