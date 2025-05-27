import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleUser, updateUserByAdmin } from '../api/ApiCollection';
import { ArrowLeft } from 'lucide-react';

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data, isSuccess, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchSingleUser(id || ''),
  });

  const user = data?.data;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isActive: false,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSuccess && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        isActive: user.isActive || false,
      });
      // Set initial preview URL from existing user image
      setPreviewUrl(user.img || '');
    }
  }, [isSuccess, user]);

  useEffect(() => {
    if (isLoading) toast.loading('Loading...', { id: 'promiseRead' });
    if (isError) toast.error('Error while getting the data!', { id: 'promiseRead' });
    if (isSuccess) toast.success('Read the data successfully!', { id: 'promiseRead' });
  }, [isLoading, isError, isSuccess]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.value === 'true',
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      // Clean up previous preview URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      setAvatarFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
      toast.success('Image selected successfully!');
    } else {
      // Reset file input if validation fails
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone } = formData;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!firstName || !lastName || !email || !phone) {
      return toast.error('Please fill in all fields!');
    }

    if (!emailRegex.test(email)) {
      return toast.error('Incorrect email format!');
    }

    try {
      toast.loading('Updating user...', { id: 'updateUser' });
      
      console.log('Submitting form data:', formData);
      console.log('Avatar file:', avatarFile);
      
      await updateUserByAdmin(id || '', formData, avatarFile || undefined);
      
      toast.success('Updated successfully!', { id: 'updateUser' });
      refetch();
      
      // Reset avatar file after successful update
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something went wrong!', { id: 'updateUser' });
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email);

  return (
    <div id="singleUser" className="w-full p-4">
      <div className="w-full flex items-center justify-between mb-4">
        <button onClick={() => navigate('/users')} className="btn btn-ghost text-sm gap-2">
          <ArrowLeft size={18} />
          Return
        </button>
      </div>

      <div className="w-full grid xl:grid-cols-2 gap-10 mt-5 xl:mt-0">
        <div className="w-full flex flex-col items-start gap-10">
          <div className="w-full flex flex-col items-start gap-5">
            <div className="w-full flex items-center gap-5">
              {isSuccess && user && (
                <div className="avatar relative group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="w-24 xl:w-36 rounded-full overflow-hidden relative">
                    <img
                      src={previewUrl || '/Portrait_Placeholder.png'}
                      alt="avatar"
                      className="object-cover w-full h-full transition-opacity duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/Portrait_Placeholder.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs">
                        {avatarFile ? 'Change Image' : 'Upload Image'}
                      </span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-semibold text-xl xl:text-3xl dark:text-white">
                  {formData.firstName} {formData.lastName}
                </h3>
                {avatarFile && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    New image ready to upload
                  </span>
                )}
              </div>
            </div>

            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.isActive.toString()}
                  onChange={handleStatusChange}
                  className="select select-bordered w-full"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-6"></div>

            <button
              className="btn btn-primary self-center xl:self-start"
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;