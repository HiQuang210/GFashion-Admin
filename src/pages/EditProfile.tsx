import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateUserByAdmin } from '../api/ApiCollection';
import IntegrationSection from '../components/IntegrationSection';

const EditProfile = () => {
  const modalDelete = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, loading, checkAuth } = useAuth();

  const [preview, setPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      if (user.img) setPreview(user.img);
    }
  }, [user]);

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (!user?._id) return toast.error('User ID not found');
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return toast.error('First Name, Last Name, and Email are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error('Please enter a valid email address');
    }

    setIsUpdating(true);
    try {
      const updateData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value.trim()) acc[key] = value.trim();
        return acc;
      }, {} as any);

      const res = await updateUserByAdmin(user._id, updateData);
      if (res.status === 'OK') {
        toast.success('Profile updated successfully!');
        checkAuth();
        navigate('/profile');
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
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setPreview(user.img || null);
    }
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

  const inputRows = [
    [
      {
        label: 'First Name',
        value: formData.firstName,
        onChange: handleChange('firstName'),
        type: 'text',
        required: true,
      },
      {
        label: 'Last Name',
        value: formData.lastName,
        onChange: handleChange('lastName'),
        type: 'text',
        required: true,
      },
      {
        label: 'Address',
        value: formData.address,
        onChange: handleChange('address'),
        type: 'textarea',
        required: false,
      }
    ],
    [
      {
        label: 'Phone',
        value: formData.phone,
        onChange: handleChange('phone'),
        type: 'tel',
        required: false,
      },
      {
        label: 'Password',
        type: 'button',
        content: (
          <div className="btn bg-gray-300 hover:bg-indigo-500 text-white transition w-full">
            Change Password
          </div>
        ),
      },
      null
    ]
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-7 xl:gap-8">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-3 xl:gap-0">
          <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">My Profile</h2>
          <div className="w-full xl:w-auto grid grid-cols-2 xl:flex gap-3">
            <button onClick={handleDiscard} disabled={isUpdating} className="btn btn-block xl:w-auto dark:btn-neutral">
              Discard Changes
            </button>
            <button onClick={handleSave} disabled={isUpdating} className="btn btn-block xl:w-auto btn-primary">
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

        <div className="flex items-center gap-3 xl:gap-8">
          <div className="relative inline-flex">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-circle btn-sm xl:btn-md absolute top-0 right-0 z-[1]"
              disabled={isUpdating}
            >
              <HiOutlinePencil className="text-xs xl:text-lg" />
            </button>
            <div className="avatar">
              <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
                <img src={preview || '/Portrait_Placeholder.png'} alt="profile-avatar" />
              </div>
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">{getDisplayName()}</h3>
            <span className="text-neutral-500">Administrator</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl">Basic Information</h4>
            <div className="flex-1 h-[2px] bg-base-300 dark:bg-slate-700 mt-1" />
          </div>

          <div className="flex flex-col">
            {inputRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid xl:grid-cols-3 gap-4">
                {row.map((field, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-4">
                    {field ? (
                      <>
                        <label className="font-medium">
                          {field.label}
                          {field.required && <span className="text-error ml-1">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            className="textarea textarea-bordered w-full"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.label}
                            disabled={isUpdating}
                            rows={2}
                          />
                        ) : field.type === 'button' ? (
                          field.content
                        ) : (
                          <input
                            type={field.type}
                            className="input input-bordered w-full"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.label}
                            disabled={isUpdating}
                            required={field.required}
                          />
                        )}
                      </>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
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
