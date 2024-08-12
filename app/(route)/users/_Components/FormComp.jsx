import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addUser, clearSelectedUser, updateUser } from '@/lib/Feature/UserSlice';
import { useEffect, useState } from 'react';

const FormComp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedUser = useSelector(state => state.user.selectedUser);

  const [formData, setFormData] = useState({
    fullName: selectedUser ? selectedUser.fullName : '',
    email: selectedUser ? selectedUser.email : '',
    address: selectedUser ? selectedUser.address : '',
    city: selectedUser ? selectedUser.city : '',
    contact: selectedUser ? selectedUser.contact : '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        address: selectedUser.address,
        city: selectedUser.city,
        contact: selectedUser.contact,
      });
    }
  }, [selectedUser]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email Address is invalid';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedUser) {
      // Update user
      dispatch(updateUser({ ...formData, id: selectedUser.id }));
      try {
        const response = await fetch('/api/updateUser', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, id: selectedUser.id }),
        });

        if (response.ok) {
          alert('User updated successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to update user: ${errorData.error}`);
        }
      } catch (error) {
        alert('An error occurred while updating the user');
      }
    } else {
      // Add new user
      dispatch(addUser(formData));
      try {
        const response = await fetch('/api/saveUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('User saved successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to save user: ${errorData.error}`);
        }
      } catch (error) {
        alert('An error occurred while saving the user');
      }
    }

    setFormData({
      fullName: '',
      email: '',
      address: '',
      city: '',
      contact: ''
    });

    dispatch(clearSelectedUser()); // Clear selected user after submitting
    router.push('/users/activeuser');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-1">User Form</h2>
      <p className="text-sm text-gray-500 mb-6">Fill date for the user. Give it a try.</p>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row justify-around">
          {/* Left Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Personal Details</h3>
            <p className="text-sm text-gray-500 mb-4">Please fill out all the fields.</p>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Delete</button>
              <button className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Edit</button>
            </div>
          </div>

          {/* Right Section - Form */}
          <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@domain.com"
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="md:w-1/2 mb-4 md:mb-0">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address / Street</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="md:w-1/2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
              </div>

              <div className="mt-6">
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {selectedUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormComp;