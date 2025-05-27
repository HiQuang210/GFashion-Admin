import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { changePassword } from '../../api/ApiCollection';

interface ChangePasswordProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const INITIAL_FORM_DATA = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
};

const PasswordInput = ({
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  name,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  name: string;
}) => (
  <div className="relative w-full">
    <input
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      className="input input-bordered w-full pr-10"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700"
    >
      {show ? <PiEyeClosedBold /> : <PiEyeBold />}
    </button>
  </div>
);

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, setIsOpen, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      setIsOpen(false);
      resetForm();
    }, 300); // match with transition duration
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(userId, {
        oldPassword: formData.oldPassword,
        newPassword: formData.password,
      });

      toast.success('Password updated successfully!');
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div
        className={`w-[90%] max-w-md rounded-lg p-6 bg-base-100 relative transition-all duration-300 ${
          showModal ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-base-300">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <PasswordInput
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            placeholder="Current Password"
          />
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            show={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
            placeholder="New Password"
          />
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Confirm New Password"
          />

          <button
            type="submit"
            className={`btn btn-block mt-4 ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
