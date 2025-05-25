import React, { ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';

interface AddUserDataProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserData: React.FC<AddUserDataProps> = ({ isOpen, setIsOpen }) => {
  // Modal state
  const [showModal, setShowModal] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // User form fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isActive, setIsActive] = React.useState('');
  const [formUserIsEmpty, setFormUserIsEmpty] = React.useState(true);

  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Password validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Here you would typically call your API to create the user
    toast('User creation not allowed yet');
  };

  const handleClose = () => {
    setShowModal(false);
    setIsOpen(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setIsActive('');
    setFile(null);
    setPreview(null);
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Form validation
  React.useEffect(() => {
    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      phone === '' ||
      password === '' ||
      confirmPassword === '' ||
      isActive === '' ||
      file === null
    ) {
      setFormUserIsEmpty(true);
    } else {
      setFormUserIsEmpty(false);
    }
  }, [email, file, firstName, isActive, lastName, phone, password, confirmPassword]);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
          showModal ? 'translate-y-0' : 'translate-y-full'
        }
          ${showModal ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button
            onClick={handleClose}
            className="absolute top-5 right-3 btn btn-ghost btn-circle"
          >
            <HiOutlineXMark className="text-xl font-bold" />
          </button>
          <span className="text-2xl font-bold">Add new user</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered w-full"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(element) => setFirstName(element.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered w-full"
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(element) => setLastName(element.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            name="email"
            id="email"
            value={email}
            onChange={(element) => setEmail(element.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="input input-bordered w-full"
            name="phone"
            id="phone"
            value={phone}
            onChange={(element) => setPhone(element.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            name="password"
            id="password"
            value={password}
            onChange={(element) => setPassword(element.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(element) => setConfirmPassword(element.target.value)}
            required
          />

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Active Status</span>
            </div>
            <select
              className="select select-bordered"
              name="isActive"
              id="isActive"
              value={isActive}
              onChange={(element) => setIsActive(element.target.value)}
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
          
          {preview && preview !== '' && (
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