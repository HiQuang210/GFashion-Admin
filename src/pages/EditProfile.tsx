import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import IntegrationSection from '../components/IntegrationSection';
import { updateUser } from '../api/ApiCollection';

const EditProfile = () => {
  const modalDelete = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [preview, setPreview] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setPreview(user.img || '');
    }
  }, [user]);

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatarFile(file); 
    }
  };

  const validateForm = () => {
    const { firstName, lastName } = formData;
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First Name and Last Name are required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user?._id) return toast.error('User ID not found');
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      const updateData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value.trim()) acc[key] = value.trim();
        return acc;
      }, {} as any);

      const res = await updateUser(user._id, updateData, avatarFile || undefined);

      if (res.status === 'OK') {
        toast.success('Profile updated successfully!');
        setTimeout(() => window.location.href = '/profile', 1000);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDiscard = () => {
    navigate('/profile');
  };

  const getDisplayName = () => {
    const { firstName, lastName, email } = formData;
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || email.split('@')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-20 text-base-content dark:text-neutral-200">No user data available.</div>;
  }

  const fields = [
    { label: 'First Name', key: 'firstName', type: 'text', required: true },
    { label: 'Last Name', key: 'lastName', type: 'text', required: true },
    { label: 'Email', key: 'email', type: 'email', required: true },
    { label: 'Phone', key: 'phone', type: 'tel', required: false }
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-7 xl:gap-8">
        {/* Header */}
        <div className="flex flex-col xl:flex-row items-start justify-between gap-3 xl:gap-0">
          <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">Edit Profile</h2>
          <div className="w-full xl:w-auto grid grid-cols-2 xl:flex gap-3">
            <button 
              onClick={handleDiscard} 
              disabled={isUpdating} 
              className="btn btn-block xl:w-auto dark:btn-neutral"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave} 
              disabled={isUpdating} 
              className="btn btn-block xl:w-auto btn-primary"
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex items-center gap-3 xl:gap-8">
          <div className="relative">
            <div className="avatar">
              <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
                <img src={preview || '/Portrait_Placeholder.png'} alt="profile-avatar" />
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-circle btn-sm xl:btn-md absolute -top-2 -right-2 z-[1]"
              disabled={isUpdating}
            >
              <HiOutlinePencil className="text-xs xl:text-lg" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
              accept="image/*"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">{getDisplayName()}</h3>
            <span className="text-neutral-500">Administrator</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl">Basic Information</h4>
            <div className="flex-1 h-[2px] bg-base-300 dark:bg-slate-700 mt-1" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="font-medium">
                  {field.label}
                  {field.required && <span className="text-error ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  className="input input-bordered w-full"
                  value={formData[field.key as keyof typeof formData]}
                  onChange={handleChange(field.key)}
                  placeholder={field.label}
                  disabled={isUpdating || field.key === 'email'}
                  required={field.required}
                />
              </div>
            ))}
          </div>
        </div>

        <IntegrationSection modalRef={modalDelete} />
      </div>
    </div>
  );
};

export default EditProfile;