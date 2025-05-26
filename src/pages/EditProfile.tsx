import React, { ChangeEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import IntegrationSection from '../components/IntegrationSection';

const EditProfile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      if (user.img) {
        setPreview(user.img);
      }
    }
  }, [user]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setSelectedFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
      console.log('Selected File: ', selectedFile);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const getDisplayName = () => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return email.split('@')[0];
    }
  };

  if (loading) {
    return (
      <div className="w-full p-0 m-0">
        <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="w-full p-0 m-0">
        <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-base-content dark:text-neutral-200">
              No user data available. Please log in again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // screen
    <div className="w-full p-0 m-0">
      {/* container */}
      <div className="w-full flex flex-col items-stretch gap-7 xl:gap-8">
        {/* block 1 */}
        <div className="flex flex-col xl:flex-row items-start justify-between gap-3 xl:gap-0">
          <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
            My Profile
          </h2>
          <div className="w-full xl:w-auto grid grid-cols-2 xl:flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-block xl:w-auto dark:btn-neutral"
            >
              Discard Changes
            </button>
            <button
              onClick={() => {
                navigate('/profile');
                toast('Profile updated successfully!', { icon: '✅' });
              }}
              className="btn btn-block xl:w-auto btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
        {/* block 2 */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          {/* Photo */}
          <div className="relative inline-flex">
            <button
              onClick={handleIconClick}
              className="btn btn-circle btn-sm xl:btn-md top-0 right-0 absolute z-[1]"
            >
              <HiOutlinePencil className="text-xs xl:text-lg" />
            </button>
            <div className="avatar">
              <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
                <img
                  src={preview || user.img || '/Portrait_Placeholder.png'}
                  alt="profile-avatar"
                />
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Heading */}
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">
              {getDisplayName()}
            </h3>
            <span className="text-normal text-neutral-500">Administrator</span>
          </div>
        </div>
        {/* block 3 */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          {/* heading */}
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
              Basic Information
            </h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>

          {/* grid */}
          <div className="w-full grid xl:grid-cols-3 gap-3 xl:gap-5 2xl:gap-20 xl:text-base">
            <div className="w-full flex flex-col gap-3 xl:gap-5">
              {/* First Name */}
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span className="whitespace-nowrap">First Name*</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              {/* Phone */}
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span className="whitespace-nowrap">Phone</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 xl:gap-5">
              {/* Last Name */}
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span className="whitespace-nowrap">Last Name*</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              {/* Password */}
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span className="whitespace-nowrap">Password</span>
                </div>
                <div className="btn col-span-2 bg-gray-300 hover:bg-indigo-500 text-white transition">
                  Change Password
                </div>
              </div>
            </div>

            {/* column 3: Address & Password */}
            <div className="w-full flex flex-col gap-3 xl:gap-5">
              {/* Address */}
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 xl:items-start gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap xl:mt-3">
                  <span className="whitespace-nowrap">Address</span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full col-span-2 2xl:col-span-3"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <IntegrationSection modalRef={modalDelete} />
      </div>
    </div>
  );
};

export default EditProfile;