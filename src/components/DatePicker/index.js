import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Paper from '@material-ui/core/Paper'

export default function DatePicker() {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  })
  
  const getInitialState = () => {
    return {
      from: undefined,
      to: undefined,
    };
  }

  const handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, dateRange)
    setDateRange(range);
  }

  const handleResetClick = () => {
    setDateRange(getInitialState)
  }

    const { from, to } = dateRange
    const modifiers = { start: from, end: to };
    return (
      <div className="RangeExample">
        <p>
          {!from && !to && 'Please select the first day.'}
          {from && !to && 'Please select the last day.'}
          {from &&
            to &&
            `Selected from ${from.toLocaleDateString()} -
                ${to.toLocaleDateString()}`}{' '}
          {from && to && (
            <button className="link" onClick={handleResetClick}>
              Reset
            </button>
          )}
        </p>
        <DayPicker
          className="Selectable"
          numberOfMonths={2}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={handleDayClick}
          show={false}
        />
          <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
`}</style>
      </div>
    );
}