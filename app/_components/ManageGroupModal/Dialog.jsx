'use client'

import React, { useEffect, useState } from 'react'
import { FaSearch, FaUserPlus, FaUserMinus, FaUser, FaEnvelope } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
const Dialog = ({ isOpen, onClose, userId }) => {
  const [userDetails, setUserDetails] = useState(null)
  const [userGroups, setUserGroups] = useState({ partOf: [], notPartOf: [] })
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [searchPartOf, setSearchPartOf] = useState('')
  const [searchNotPartOf, setSearchNotPartOf] = useState('')
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, groupId: null });
  useEffect(() => {
    if (!userId || !isOpen) return

    setLoading(true)
    setError(null)
    

 
    
    const fetchUserDetails = async (userId) => {
      try {
        const response = await fetch(`/api/Users/manageGroupsUser/getUserDetail?userId=${userId}`)
        const data = await response.json()

        if (response.ok) {
          setUserDetails(data.user)
          setUserGroups(data.userGroups)
        } else {
          throw new Error(data.error || 'Failed to fetch user details')
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails(userId)
  }, [userId, isOpen])

  const handleGroupClick = (group) => {
    setSelectedGroup(group)
    setGroupModalOpen(true)
  }

  const handleCloseGroupModal = () => {
    setGroupModalOpen(false)
    setSelectedGroup(null)
  }

  const handleClose = () => {
    setUserDetails(null)
    setUserGroups({ partOf: [], notPartOf: [] })
    setSelectedGroup(null)
    setGroupModalOpen(false)
    onClose()
  }

  const filteredPartOf = userGroups.partOf.filter(group =>
    group.groupName.toLowerCase().includes(searchPartOf.toLowerCase())
  )

  const filteredNotPartOf = userGroups.notPartOf.filter(group =>
    group.groupName.toLowerCase().includes(searchNotPartOf.toLowerCase())
  )

  if (!isOpen) return null


  //add user ninto group and remove
  const handleRemoveGroup = (groupId) => {
    setConfirmationDialog({ isOpen: true, groupId });
  };
  
  const confirmRemoveGroup = async () => {
    const groupId = confirmationDialog.groupId;
    try {
      const response = await fetch(`/api/Users/manageGroupsUser/removeGroupUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, groupId }),
      });
  
      if (response.ok) {
        setUserGroups((prevGroups) => ({
          partOf: prevGroups.partOf.filter((group) => group._id !== groupId),
          notPartOf: [...prevGroups.notPartOf, prevGroups.partOf.find((group) => group._id === groupId)],
        }));
        setHasChanges(true);
      } else {
        throw new Error('Failed to remove group');
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setConfirmationDialog({ isOpen: false, groupId: null });
    }
  };
  
  const cancelRemoveGroup = () => {
    setConfirmationDialog({ isOpen: false, groupId: null });
  };


  const router = useRouter();

  const handleSaveChanges = async () => {
       setUserDetails(null)
    setUserGroups({ partOf: [], notPartOf: [] })
    setSelectedGroup(null)
    setGroupModalOpen(false)
    
    onClose()
    setHasChanges(false);  // Reset the changes state
    router.push('/users/active');
 
};

//end here add user and remove
  return (
    <div className="scrollbar-hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-xl shadow-2xl w-11/12 max-w-4xl relative h-[535px] overflow-hidden">
        <button
          className="absolute top-1 right-2 text-3xl font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#3B82F6" size={50} />
          </div>
        ) : error ? (
          <p className="text-gray-500 dark:text-gray-400 text-center text-xl">{error}</p>
        ) : (
          userDetails && (
            <div className="space-y-8 h-full flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white text-blue-500 rounded-full p-3">
                      <FaUser className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{userDetails.fullName}</h2>
                      <div className="flex items-center mt-1">
                        <FaEnvelope className="w-4 h-4 mr-2" />
                        <p className="text-sm">{userDetails.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Status : {userDetails.status}</p>

                  </div>
                  
                </div>
              </div>

              <div className="flex-grow overflow-hidden flex flex-col md:flex-row gap-8">
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Groups the user is part of:</h3>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={searchPartOf}
                      onChange={(e) => setSearchPartOf(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <ul className="space-y-2 overflow-y-auto flex-grow">
                    {filteredPartOf.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No groups found</p>
                    ) : (
                      filteredPartOf.map((group) => (
                        <li
                          key={group._id}
                          className="flex items-center justify-between py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <span className="cursor-pointer" onClick={() => handleGroupClick(group)}>{group.groupName}</span>
                          <button
                            className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            aria-label={`Remove from ${group.groupName}`}
                            onClick={() => handleRemoveGroup(group._id)}
                          >
                            <FaUserMinus />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col scrollbar-hidden">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Groups the user is not part of:</h3>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={searchNotPartOf}
                      onChange={(e) => setSearchNotPartOf(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <ul className="space-y-2 overflow-y-auto flex-grow">
                    {filteredNotPartOf.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No groups available</p>
                    ) : (
                      filteredNotPartOf.map((group) => (
                        <li
                          key={group._id}
                          className="flex items-center justify-between py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <span className="cursor-pointer" onClick={() => handleGroupClick(group)}>{group.groupName}</span>
                          <button
                            className="ml-2 p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                            aria-label={`Add to ${group.groupName}`}
                          >
                            <FaUserPlus />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                  
                </div>
                {hasChanges && (
                  <div className="fixed bottom-8 right-56">
                    <button
                      onClick={handleSaveChanges}
                      className="px-1 py-0 h-6  bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
             
            </div>
          )
        )}
      </div>
      {confirmationDialog.isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-2xl w-11/12 max-w-sm">
      <h3 className="text-xl font-semibold mb-4">Confirm Removal</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to remove this user from the group?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={cancelRemoveGroup}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          No
        </button>
        <button
          onClick={confirmRemoveGroup}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
)}

      {groupModalOpen && selectedGroup && (
        <div className="scrollbar-hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-xl shadow-2xl w-11/12 max-w-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
            <button
              className="absolute top-4 right-4 text-3xl font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={handleCloseGroupModal}
              aria-label="Close group details"
            >
              &times;
            </button>
            <div className="overflow-y-auto flex-grow scrollbar-hidden">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedGroup.groupName}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedGroup.groupDescription || 'No description'}</p>

                <div>
                  <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Group Owners:</h4>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedGroup.groupOwrnerID && selectedGroup.groupOwrnerID.length > 0 ? (
                      selectedGroup.groupOwrnerID.map((owner) => (
                        <li key={owner._id} className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          {owner.fullName || 'No Name'} ({owner.email})
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No owners found</p>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Group Members:</h4>
                  <ul className="space-y-1 max-h-40 overflow-y-auto scrollbar-hidden">
                    {selectedGroup.groupTargetID && selectedGroup.groupTargetID.length > 0 ? (
                      selectedGroup.groupTargetID.map((member) => (
                        <li key={member._id} className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          {member.fullName || 'No Name'} ({member.email})
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No members found</p>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Group Status:</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedGroup.status || 'No status available'}
                  </p>
                </div>
                
              </div>
            </div>
           
          </div>
        </div>
      )}
    </div>
  )
}

export default Dialog
