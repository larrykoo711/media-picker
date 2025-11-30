import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { MediaPicker } from './MediaPicker';
import type { MediaPickerButtonProps } from '../types';

export function MediaPickerButton({
  children,
  className,
  disabled,
  type = 'button',
  ...pickerProps
}: MediaPickerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={className ?? 'btn btn-primary'}
        onClick={() => setOpen(true)}
      >
        {children ?? (
          <>
            <ImagePlus className="h-4 w-4" />
            Select Media
          </>
        )}
      </button>

      <MediaPicker {...pickerProps} open={open} onOpenChange={setOpen} />
    </>
  );
}
