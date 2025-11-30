import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { usePickerStore, pickerSelectors } from '../store/picker-store';

export function Toast() {
  const toastState = usePickerStore(pickerSelectors.toast);
  const hideToast = usePickerStore(pickerSelectors.hideToast);

  useEffect(() => {
    if (toastState?.visible) {
      const toastOptions = {
        duration: 3000,
        onDismiss: () => hideToast(),
        onAutoClose: () => hideToast(),
      };

      switch (toastState.type) {
        case 'error':
          toast.error(toastState.message, toastOptions);
          break;
        case 'warning':
          toast.warning(toastState.message, toastOptions);
          break;
        case 'info':
        default:
          toast.info(toastState.message, toastOptions);
          break;
      }
    }
  }, [toastState?.visible, toastState?.message, toastState?.type, hideToast]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: 'media-picker-toast',
        style: {
          background: 'var(--mp-base-100, #ffffff)',
          color: 'var(--mp-base-content, #1e293b)',
          border: '1px solid var(--mp-base-300, #e2e8f0)',
        },
      }}
    />
  );
}

// Re-export toast for direct usage if needed
export { toast };
