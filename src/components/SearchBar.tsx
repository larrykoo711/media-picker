import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { usePickerStore, pickerSelectors } from '../store/picker-store';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search photos or videos...' }: SearchBarProps) {
  const query = usePickerStore(pickerSelectors.query);
  const setQuery = usePickerStore(pickerSelectors.setQuery);
  const [inputValue, setInputValue] = useState(query);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef(false);

  // Debounced search - triggers 500ms after user stops typing
  // But doesn't trigger during IME composition (waiting for character selection)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't trigger search during composition (pinyin/japanese input)
    if (isComposingRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setQuery(inputValue);
    }, 800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, setQuery]);

  // Sync external query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // IME composition start
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  // IME composition end - start countdown here
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    // Manually trigger search countdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setQuery(inputValue);
    }, 800);
  };

  const handleClear = () => {
    setInputValue('');
    setQuery('');
  };

  return (
    <label className="flex w-full items-center gap-2 bg-base-100 px-3 py-2">
      <Search className="h-4 w-4 opacity-50" />
      <input
        type="text"
        className="grow bg-transparent text-sm outline-none"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        autoFocus
      />
      {inputValue && (
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-xs"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </label>
  );
}
