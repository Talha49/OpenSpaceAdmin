import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addUser,
  clearSelectedUser,
  updateUser,
} from "@/lib/Feature/UserSlice";
import { useEffect, useRef, useState } from "react";
import { fetchUsers } from "@/lib/Feature/UserSlice";
const FormComp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const emailInputRef = useRef(null); // Create the ref

  const [message, setMessage] = useState({ text: "", type: "" }); // For success/error messages
  const [isLoading, setIsLoading] = useState(false); // Track button loading state
  const [formData, setFormData] = useState({
    fullName: selectedUser ? selectedUser.fullName : "",
    email: selectedUser ? selectedUser.email : "",
    address: selectedUser ? selectedUser.address : "",
    city: selectedUser ? selectedUser.city : "",
    country: selectedUser ? selectedUser.country : "",
    contact: selectedUser ? selectedUser.contact : "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch groups when the component mounts
    dispatch(fetchUsers());
  }, [dispatch]);

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

  useEffect(() => {
    if (message.type === "error" && message.text.includes("email")) {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
        emailInputRef.current.select(); // Select the text in the email input
      }
    }
  }, [message]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email Address is invalid";
    }

    // if (!formData.address) {
    //   newErrors.address = "Address is required";
    // }

    // if (!formData.city) {
    //   newErrors.city = "City is required";
    // }

    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{11}$/.test(formData.contact)) {
      newErrors.contact = "Contact number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true); // Set loading state to true when submission starts

    const userData = {
      ...formData,
      createdByAdmin: !selectedUser, // New user if no selected user
    };

    if (selectedUser) {
      // Update user
      dispatch(updateUser({ ...userData, id: selectedUser.id }));

      try {
        const response = await fetch("/api/Users/updateUser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData, id: selectedUser.id }),
        });

        if (response.ok) {
          showMessage("User updated successfully!", "success");
        } else {
          const errorData = await response.json();
          showMessage(`Failed to update user: ${errorData.error}`, "error");
        }
      } catch (error) {
        showMessage("An error occurred while updating the user.", "error");
      }
    } else {
      // Add new user
      dispatch(addUser(userData));

      try {
        const response = await fetch("/api/Users/saveUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          showMessage("User saved successfully!", "success");

          setFormData({
            fullName: "",
            email: "",
            address: "",
            city: "",
            contact: "",
          });

          dispatch(clearSelectedUser());
          router.push("/users/active");
        } else {
          const errorData = await response.json();
          if (errorData.message === "User with this email already exists") {
            showMessage("User with this email already exists.", "error");

            // Focus on the email field and select the text
            if (emailInputRef.current) {
              emailInputRef.current.focus();
              emailInputRef.current.select(); // Select the text in the email input
            }
          } else {
            showMessage(`Failed to save user: ${errorData.error}`, "error");
          }
        }
      } catch (error) {
        showMessage("An error occurred while saving the user.", "error");
      } finally {
        setIsLoading(false); // Reset loading state once request completes
      }
    }
  };

  // Helper function to show a message with timeout
  const showMessage = (text, type) => {
    setMessage({ text, type });

    // Hide message after 2 seconds
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      // Allow only letters and spaces for full name
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "contact") {
      // Allow only numbers for contact
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      // Allow any value for email (validate separately if needed)
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    router.push("/users/main");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 dark:bg-neutral-950">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-400 mb-2">
        Create User
      </h2>

      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-8 border dark:border-neutral-700">
        <div className="flex flex-col md:flex-row justify-around">
          {/* Left Section */}
          {/* <div className="mb-6 md:mb-0"> */}
          {/* <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-400 mb-1">
              Personal Details
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
              Please fill out all the fields.
            </p> */}
          {/* <div className="space-y-2">
              <button className="w-full py-2 px-4  text-gray-700 rounded-md blue-button focus:outline-none focus:ring-2 focus:ring-gray-400">Delete</button>
              <button className="w-full py-2 px-4  text-gray-700 rounded-md blue-button focus:outline-none focus:ring-2 focus:ring-gray-400">Edit</button>
            </div> */}
          {/* </div> */}

          {/* Right Section - Form */}
          <div className="w-full">
            {message.text && (
              <div
                className={`p-4 mb-4 text-sm rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                  >
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Your Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border placeholder:text-sm ${
                      errors.fullName ? "border-red-500" : "border-neutral-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                  >
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    ref={emailInputRef} // Attach the ref to the email input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@domain.com"
                    className={`w-full px-3 py-2 border placeholder:text-sm ${
                      errors.email ? "border-red-500" : "border-neutral-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                >
                  Address / Street
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Your Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border placeholder:text-sm ${
                    errors.address ? "border-red-500" : "border-neutral-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Your City"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border placeholder:text-sm ${
                      errors.city ? "border-red-500" : "border-neutral-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="w-full md:mb-0">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Your Country Name"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border placeholder:text-sm ${
                      errors.country ? "border-red-500" : "border-neutral-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-neutral-800 dark:text-neutral-500 mb-1"
                  >
                    Contact <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    placeholder="Your Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border placeholder:text-sm ${
                      errors.contact ? "border-red-500" : "border-neutral-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                  }`}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading
                    ? "Creating..."
                    : selectedUser
                    ? "Update"
                    : "Create"}
                </button>
                <button
                  type="button" // Prevent the form from submitting
                  className="px-6 ml-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleCancel} // Use onClick instead of onSubmit
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComp;
