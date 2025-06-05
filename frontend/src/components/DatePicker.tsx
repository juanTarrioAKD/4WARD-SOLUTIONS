'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  isDisabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  minDate,
  placeholderText,
  isDisabled = false
}) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      placeholderText={placeholderText}
      className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
      dateFormat="dd/MM/yyyy"
      calendarClassName="!bg-[#2d1830] !border !border-[#a16bb7] !rounded-lg !shadow-xl"
      dayClassName={date =>
        date.getTime() === (selected?.getTime() || 0)
          ? "!bg-[#e94b5a] !text-white !rounded-full"
          : "!text-white hover:!bg-[#a16bb7] !rounded-full"
      }
      monthClassName={() => "!text-white"}
      weekDayClassName={() => "!text-[#a16bb7]"}
      disabled={isDisabled}
      popperClassName="!z-50"
      popperPlacement="bottom-start"
      showPopperArrow={false}
    />
  );
};

export default DatePicker; 