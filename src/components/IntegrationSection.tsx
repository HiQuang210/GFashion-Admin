import React from 'react';
import { HiOutlineUserMinus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
};

const IntegrationSection = ({ modalRef }: Props) => {
  return (
    <div className="w-full flex flex-col items-stretch gap-6 xl:gap-7">
      {/* heading */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center w-full gap-3 xl:gap-5">
          <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
            Account Integrations
          </h4>
          <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
        </div>
        <span className="text-sm xl:text-sm text-neutral-400 dark:text-neutral-content">
          Authorize faster and easier with your external service account.
        </span>
      </div>

      {/* services block */}
      <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-3 xl:flex gap-5">
        {/* column 1 */}
        <div className="col-span-2 flex flex-col items-start gap-5 xl:w-[240px]">
          <div className="px-4 gap-2 min-h-12 text-sm font-semibold flex items-center justify-start">
            <img
              className="w-6"
              src="/icons8-google.svg"
              alt="google"
            />
            <span className="text-start whitespace-nowrap text-xs xl:text-sm">
              Connected with Google
            </span>
          </div>
        </div>
        {/* column 2 */}
        <div className="col-span-1 flex flex-col items-start gap-5">
          <button
            onClick={() => toast('Feature not available yet')}
            className="btn btn-ghost text-error text-xs xl:text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* deactivate account button and modal */}
      <div className="w-full flex justify-start items-center mt-4">
        <button
          className="btn dark:btn-neutral text-error dark:text-error text-xs xl:text-sm"
          onClick={() => modalRef.current?.showModal()}
        >
          <HiOutlineUserMinus className="text-lg" />
          Deactivate My Account
        </button>
        <dialog id="modal_delete" className="modal" ref={modalRef}>
          <div className="modal-box">
            <h3 className="font-bold text-lg dark:text-white">
              Account Deactivation
            </h3>
            <p className="py-4">
              Do you want to deactivate your account? You will lose access to all features but your data will be preserved and you can reactivate later.
            </p>
            <div className="modal-action mx-0 flex-col items-stretch justify-stretch gap-3">
              <button
                onClick={() =>
                  toast.error('Account deactivation is not allowed for admin users!')
                }
                className="btn btn-error btn-block text-base-100 dark:text-white"
              >
                Yes, deactivate my account
              </button>
              <form method="dialog" className="m-0 w-full">
                <button className="m-0 btn btn-block dark:btn-neutral">
                  No, keep my account active
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default IntegrationSection;