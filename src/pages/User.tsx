import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleUser, updateUserByAdmin } from '../api/ApiCollection';
import { ArrowLeft } from 'lucide-react';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const maxSize = 5 * 1024 * 1024; 

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', isActive: false });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const { isLoading, isError, data, isSuccess, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchSingleUser(id || ''),
  });

  const user = data?.data;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        isActive: user.isActive || false,
      });
      setPreviewUrl(user.img || '');
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) toast.loading('Loading...', { id: 'promiseRead' });
    if (isError) toast.error('Error while getting the data!', { id: 'promiseRead' });
    if (isSuccess) toast.success('Read the data successfully!', { id: 'promiseRead' });
  }, [isLoading, isError, isSuccess]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }));
  };

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file');
      return false;
    }
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return (fileInputRef.current!.value = '');

    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    toast.success('Image selected successfully!');
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone } = formData;

    if (!firstName || !lastName || !email || !phone) return toast.error('Please fill in all fields!');
    if (!emailRegex.test(email)) return toast.error('Incorrect email format!');

    try {
      toast.loading('Updating user...', { id: 'updateUser' });
      await updateUserByAdmin(id || '', formData, avatarFile || undefined);
      toast.success('Updated successfully!', { id: 'updateUser' });
      refetch();
      setAvatarFile(null);
      fileInputRef.current!.value = '';
    } catch {
      toast.error('Something went wrong!', { id: 'updateUser' });
    }
  };

  const isFormValid = Object.values(formData).every(Boolean) && emailRegex.test(formData.email);

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <button onClick={() => navigate('/users')} className="btn btn-ghost text-sm gap-2">
          <ArrowLeft size={18} />
          Return
        </button>
      </div>

      <div className="grid xl:grid-cols-2 gap-10 mt-5">
        <div className="flex flex-col gap-10">
          <div className="flex gap-5 items-center">
            {isSuccess && (
              <div className="avatar relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 xl:w-36 rounded-full overflow-hidden relative">
                  <img
                    src={previewUrl || '/Portrait_Placeholder.png'}
                    alt="avatar"
                    className="object-cover w-full h-full"
                    onError={(e) => ((e.target as HTMLImageElement).src = '/Portrait_Placeholder.png')}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">
                      {avatarFile ? 'Change Image' : 'Upload Image'}
                    </span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={allowedTypes.join(',')}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-xl xl:text-3xl">{`${formData.firstName} ${formData.lastName}`}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
            {['firstName', 'lastName', 'email', 'phone'].map((field) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize">{field}</label>
                <input
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <select value={formData.isActive.toString()} onChange={handleStatusChange} className="select select-bordered">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="w-full h-[2px] bg-base-300 mt-6" />

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
  );
};

export default User;
