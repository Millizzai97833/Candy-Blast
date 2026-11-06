import React, { useEffect } from 'react';
import { startIo } from '../services/startioAds';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

export const StartIoInterstitial: React.FC<Props> = ({
  isOpen,
  onClose,
  triggerReason = 'Game Event'
}) => {

  useEffect(() => {

    if (!isOpen) return;

    startIo.recordInterstitialImpression(triggerReason);

    onClose();

  }, [isOpen, triggerReason, onClose]);

  return null;
};
