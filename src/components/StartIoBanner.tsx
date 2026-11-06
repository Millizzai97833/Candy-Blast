import React, { useEffect } from 'react';
import { startIo } from '../services/startioAds';

interface Props {
  onOpenSdkModal?: () => void;
}

export const StartIoBanner: React.FC<Props> = () => {

  useEffect(() => {
    startIo.recordBannerImpression();
  }, []);

  // The actual banner is created by the native Android SDK.
  return null;
};
