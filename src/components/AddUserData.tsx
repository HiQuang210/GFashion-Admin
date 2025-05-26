import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

interface AddUserDataProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputWithEyeToggle = ({
  value,
  onChange,
  show,
  setShow,
  placeholder,
  name,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
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
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500"
    >
      {show ? <PiEyeClosedBold /> : <PiEyeBold />}
    </button>
  </div>
);

const AddUserData: React.FC<AddUserDataProps> = ({ isOpen, setIsOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formUserIsEmpty, setFormUserIsEmpty] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isActive: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const image = e.target.files[0];
      setFile(image);
      setPreview(URL.createObjectURL(image));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast('User creation not allowed yet');
  };

  const handleClose = () => {
    setShowModal(false);
    setIsOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isActive: '',
    });
    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const { firstName, lastName, email, phone, password, confirmPassword, isActive } = formData;
    setFormUserIsEmpty(
      !firstName || !lastName || !email || !phone || !password || !confirmPassword || !isActive || !file
    );
  }, [formData, file]);

  const inputFields = [
    { name: 'firstName', placeholder: 'First Name' },
    { name: 'lastName', placeholder: 'Last Name' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'phone', placeholder: 'Phone', type: 'tel' },
  ];

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col gap-5 ${
          showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button onClick={handleClose} className="absolute top-5 right-3 btn btn-ghost btn-circle">
            <HiOutlineXMark className="text-xl font-bold" />
          </button>
          <span className="text-2xl font-bold">Add new user</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inputFields.map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type || 'text'}
              name={name}
              id={name}
              placeholder={placeholder}
              className="input input-bordered w-full"
              value={(formData as any)[name]}
              onChange={handleChange}
              required
            />
          ))}

          <InputWithEyeToggle
            value={formData.password}
            onChange={handleChange}
            show={showPassword}
            setShow={setShowPassword}
            placeholder="Password"
            name="password"
          />
          <InputWithEyeToggle
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            placeholder="Confirm Password"
            name="confirmPassword"
          />

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Active Status</span>
            </div>
            <select
              className="select select-bordered"
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              required
            >
              <option disabled value="">
                Select one
              </option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Pick a profile photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={loadImage}
              accept="image/*"
              required
            />
          </label>

          {preview && (
            <div className="w-full flex flex-col items-start gap-3">
              <span>Profile Preview</span>
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={preview} alt="profile-upload" />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`mt-5 btn ${
              formUserIsEmpty ? 'btn-disabled' : 'btn-primary'
            } btn-block col-span-full font-semibold`}
            disabled={formUserIsEmpty}
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserData;
