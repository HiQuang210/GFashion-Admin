import { useEffect, useState } from 'react';

interface UseModalTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  transitionDuration?: number;
}

interface UseModalTransitionReturn {
  showModal: boolean;
  handleClose: () => void;
}

export const useModalTransition = ({
  isOpen,
  onClose,
  transitionDuration = 300,
}: UseModalTransitionProps): UseModalTransitionReturn => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, transitionDuration);
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  return {
    showModal,
    handleClose,
  };
};