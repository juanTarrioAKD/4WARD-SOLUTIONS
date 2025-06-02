'use client';

import { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  className?: string;
}

const DatePicker = ({
  selected,
  onChange,
  minDate,
  placeholderText,
  className
}: DatePickerProps) => {
  const CustomInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        readOnly
        placeholder={placeholderText}
        className={className}
      />
    )
  );
  CustomInput.displayName = 'CustomInput';

  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput />}
      placeholderText={placeholderText}
    />
  );
};

export default DatePicker; 