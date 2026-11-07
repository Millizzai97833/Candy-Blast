import React, { useEffect, useState } from 'react';
import { startIo } from '../services/startioAds';

type RewardType = 'moves' | 'hammer' | 'color_bomb' | 'life';

interface Props {
  isOpen: boolean;
  rewardType: RewardType;
  onClose: () => void;
  onRewardClaimed: (rewardType: RewardType) => void;
}

export const StartIoRewardedModal: React.FC<Props> = ({
  isOpen,
  rewardType,
  onClose,
  onRewardClaimed
}) => {

  const [requested, setRequested] = useState(false);

  useEffect(() => {

    if (!isOpen || requested) return;

    if (!startIo.isNativeAndroid()) {
      return;
    }

    setRequested(true);

    const unsubscribe = startIo.onNativeReward((completedType) => {

      onRewardClaimed(completedType as RewardType);

      onClose();
    });

    startIo.recordRewardedImpression(rewardType);

    return unsubscribe;

  }, [
    isOpen,
    requested,
    rewardType,
    onClose,
    onRewardClaimed
  ]);

  useEffect(() => {
    if (!isOpen) {
      setRequested(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5">

      <div className="w-full max-w-sm rounded-2xl bg-purple-950 border border-pink-500 p-5 text-center">

        <div className="text-4xl mb-3">🎁</div>

        <h2 className="text-white text-xl font-bold mb-2">
          Rewarded Advertisement
        </h2>

        <p className="text-purple-200 text-sm mb-4">
          Watch the sponsored video completely to receive your reward.
        </p>

        <p className="text-yellow-300 text-sm mb-4">
          {requested ? 'Waiting for Start.io native ad...' : 'Start.io Rewarded Video triggers natively on Android.'}
        </p>

        {!startIo.isNativeAndroid() ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onRewardClaimed(rewardType);
                onClose();
              }}
              className="flex-1 rounded-xl bg-green-600 hover:bg-green-500 py-3 text-white font-bold text-xs"
            >
              Claim Reward (Preview)
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-4 py-3 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-pink-600 py-3 text-white font-bold"
          >
            Close
          </button>
        )}

      </div>

    </div>
  );
};
