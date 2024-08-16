"use client"
import Table from '@/app/_components/TableComponent/TableComponent'
import UserDetailDialog from '@/app/_components/UserDetailDilaog/UserDetailDilaog'
import Header from '@/app/_HOC/Header/Header'
import { fetchUsers, selectPaginatedUsers, selectTotalPages, setCurrentPage, setSearchTerm, setSortOrder } from '@/lib/Feature/UserSlice'
import React, { useEffect, useState } from 'react'
import { FaSyncAlt, FaTrash, FaUserPlus } from 'react-icons/fa'
import { MdGroups3 } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

 const GroupFormComp = () => {
    
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [dialogUser, setDialogUser] = useState(null);
    const [addGroupMode, setaddGroupMode] = useState(false);

    const dispatch = useDispatch()
    const users = useSelector(selectPaginatedUsers);
    const totalPages = useSelector(selectTotalPages);
    const currentPage = useSelector(state => state.user.currentPage);
    const searchTerm = useSelector(state => state.user.searchTerm);
    const sortOrder = useSelector(state => state.user.sortOrder);

    useEffect(() => {
        dispatch(fetchUsers());
      }, [dispatch]);
 
      const handleSearchChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
      };

      const handleUserClick = (user) => setDialogUser(user);
      const closeDialog = () => setDialogUser(null);
    

      const handleRefresh = () => {
        dispatch(fetchUsers());
      };
      const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
      };
    
      const handleSort = () => dispatch(setSortOrder(!sortOrder));

      const handleCheckboxChange = (userId) => {
        setSelectedUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      };
    
      const handleSelectAll = (event) => {
        if (event.target.checked) {
          setSelectedUsers(users.map((user) => user.id));
        } else {
          setSelectedUsers([]);
        }
      };
      const toggleAddGroup = () =>{
        setaddGroupMode(!addGroupMode);
        setSelectedUsers([]);
      }
      
    const buttons =[
        { icon: MdGroups3, text: "Add a Group", onClick: toggleAddGroup },
        { icon: FaSyncAlt, text: "Refresh", onClick: handleRefresh },
    ]

    const handle = () =>{

    }


    const columns = [
        { key: "fullName", label: "Display Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "address", label: "Address", sortable: true },
        { key: "city", label: "City", sortable: true },
        { key: "contact", label: "Contact", sortable: true },
      ];
    return (
        <div>
            <div>
                <Header title='Talha.ae' buttons={buttons} searchTerm={searchTerm}  actionMode='Create Group' onSearchChange={handleSearchChange} mode={addGroupMode}/>
            </div>
            
            <div className='mt-4'>
                <Table
                 columns={columns}
                 data={users}
                onSort={handleSort}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onRowClick={handleUserClick}
                selectedItems={selectedUsers}
                onCheckboxChange={handleCheckboxChange}
                onSelectAll={handleSelectAll}
                mode={addGroupMode} 
                />

            </div>


            {dialogUser && (
        <UserDetailDialog
          isOpen={!!dialogUser}
          onClose={closeDialog}
          user={dialogUser}
        />
      )}

        </div>
    )
}

export default GroupFormComp
