import React, { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@api/ApiCollection'; 
import { useModalTransition } from '@hooks/useModalTransition';

interface AddUserDataProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUserAdded?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const INPUT_FIELDS = [
  { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
  { name: 'lastName', placeholder: 'Last Name', type: 'text', required: true },
  { name: 'email', placeholder: 'Email', type: 'email', required: true },
  { name: 'phone', placeholder: 'Phone', type: 'tel', required: true },
] as const;

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

const AddUserData: React.FC<AddUserDataProps> = ({ isOpen, setIsOpen, onUserAdded }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const isFormValid = 
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '';

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
  };

  const { showModal, handleClose } = useModalTransition({
    isOpen,
    onClose: () => {
      setIsOpen(false);
      resetForm();
    },
  });


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      await registerUser(userData);
      toast.success('User created successfully!');
      handleClose();
      onUserAdded?.();

      setTimeout(() => {
        navigate('/users');
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create user. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div
        className={`w-[90%] max-w-2xl rounded-lg p-6 bg-base-100 relative transition-all duration-300 ${
          showModal ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-base-300">
          <h2 className="text-2xl font-bold">Add New User</h2>
          <button 
            onClick={handleClose} 
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INPUT_FIELDS.map(({ name, placeholder, type, required }) => (
              <input
                key={name}
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                className="input input-bordered w-full"
                value={formData[name as keyof FormData]}
                onChange={handleChange}
                required={required}
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              placeholder="Password"
              name="password"
            />
            <PasswordInput
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm Password"
              name="confirmPassword"
            />
          </div>

          <button
            type="submit"
            className={`btn btn-block mt-6 ${
              isFormValid && !isLoading ? 'btn-primary' : 'btn-disabled'
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating User...
              </>
            ) : (
              'Add User'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserData;