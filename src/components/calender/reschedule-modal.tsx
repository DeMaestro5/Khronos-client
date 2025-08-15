import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  fromDateKey: string; // YYYY-MM-DD
  toDateKey: string; // YYYY-MM-DD
  originalDateISO: string; // original scheduledDate ISO
  onConfirm: (newDateISO: string) => Promise<void> | void;
}

function formatDisplay(dateISO: string) {
  try {
    return new Date(dateISO).toLocaleString();
  } catch {
    return dateISO;
  }
}

function getTimeFromISO(dateISO: string): string {
  const d = new Date(dateISO);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function buildISO(dateKey: string, timeHHMM: string): string {
  // dateKey: YYYY-MM-DD
  const [h, m] = timeHHMM.split(':').map((v) => parseInt(v, 10));
  const [y, mo, d] = dateKey.split('-').map((v) => parseInt(v, 10));
  // Construct in local time and convert to ISO string
  const dt = new Date(y, (mo || 1) - 1, d || 1, h || 0, m || 0, 0, 0);
  return dt.toISOString();
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  onClose,
  fromDateKey,
  toDateKey,
  originalDateISO,
  onConfirm,
}) => {
  const originalTime = useMemo(
    () => getTimeFromISO(originalDateISO),
    [originalDateISO]
  );
  const [mode, setMode] = useState<'keep' | 'change'>('keep');
  const [time, setTime] = useState<string>(originalTime);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMode('keep');
      setTime(originalTime);
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open, originalTime]);

  if (!open) return null;

  const handleConfirm = async () => {
    const chosenTime = mode === 'keep' ? originalTime : time;
    const newISO = buildISO(toDateKey, chosenTime);
    setSaving(true);
    try {
      await onConfirm(newISO);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const modal = (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4'
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className='w-full max-w-md rounded-2xl bg-theme-card border border-theme-primary shadow-xl'>
        <div className='p-4 border-b border-theme-primary'>
          <h3 className='text-lg font-semibold text-theme-primary'>
            Reschedule content
          </h3>
          <p className='text-sm text-theme-secondary mt-1'>
            Move from <span className='font-medium'>{fromDateKey}</span> to{' '}
            <span className='font-medium'>{toDateKey}</span>
          </p>
          <p className='text-xs text-theme-muted mt-1'>
            Original: {formatDisplay(originalDateISO)}
          </p>
        </div>

        <div className='p-4 space-y-4'>
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm text-theme-primary'>
              <input
                type='radio'
                name='time-mode'
                checked={mode === 'keep'}
                onChange={() => setMode('keep')}
                className='accent-accent-primary'
              />
              Keep the same time ({originalTime})
            </label>
            <label className='flex items-center gap-2 text-sm text-theme-primary'>
              <input
                type='radio'
                name='time-mode'
                checked={mode === 'change'}
                onChange={() => setMode('change')}
                className='accent-accent-primary'
              />
              Choose a different time
            </label>
          </div>

          {mode === 'change' && (
            <div className='flex items-center gap-3'>
              <label className='text-sm text-theme-secondary'>Time</label>
              <input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className='px-3 py-2 rounded-lg border border-theme-primary bg-theme-background text-theme-primary'
              />
            </div>
          )}
        </div>

        <div className='p-4 border-t border-theme-primary flex items-center justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-theme-primary text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className='px-4 py-2 rounded-lg bg-accent-primary text-white hover:bg-accent-secondary disabled:opacity-50'
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return modal;
  return createPortal(modal, document.body);
};

export default RescheduleModal;
