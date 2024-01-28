import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { setActiveFilters } from '../redux/settings/ordersSetting';
import { useDispatch, useSelector } from 'react-redux';

export default function CalanderStrip() {
  const [dates, setDates] = useState([]);
  const [todayIndex, setTodayIndex] = useState(0);
  const [activeDate, setActiveDate] = useState(new Date().getDate());
    // const activeFliter = useSelector((state) => state.ordersSetting.activeFilters);
  const dispatch = useDispatch();

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() - 3); // Subtract 3 days from the current date
    const dates = [...Array(7)].map((_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
    const todayIndex = dates.findIndex(date => date.toDateString() === today.toDateString());
    setDates(dates);
    setTodayIndex(todayIndex);
    setActiveDate(new Date().getDate());
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(activeDate);
    const minDateCreated = formatDate(today);
    today.setDate(activeDate + 1);
    const maxDateCreated = formatDate(today);
    if (activeDate){
    dispatch(setActiveFilters([
      { value: minDateCreated, label: 'min_date_created', active: true },
      { value: maxDateCreated, label: 'max_date_created', active: true },
    ]));
    }else{
        dispatch(setActiveFilters(activeFliter.filter(filter => filter.label !== 'min_date_created' && filter.label !== 'max_date_created')));

    }
  }, [activeDate]);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const onArrowClick = (direction) => {
    const newDates = [...dates];

    if (direction === 'left') {
      const startDate = newDates[0];
      startDate.setDate(startDate.getDate() - 1);
      const newDateArray = [...Array(7)].map((_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
      setDates(newDateArray);
    } else {
      const firstDate = newDates.shift();
      const lastDate = newDates[newDates.length - 1];
      const nextDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1);
      newDates.push(nextDay);
      setDates(newDates);
    }
  };

  const onDateClick = (date) => {
    if (date.getDate() === activeDate) {
      setActiveDate(null);
    } else {
      setActiveDate(date.getDate());
    }
  };

  return (
    <Box sx={{ width: '100%', height: '40Px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <ArrowBackIosIcon onClick={() => onArrowClick('left')} />
      {dates && dates.map((date, i) => (
        <Box key={i} sx={{ border: '1px solid #000000', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', flexDirection: 'column', backgroundColor: date.getDate() === activeDate ? '#000000' : '#ffffff', color: date.getDate() === activeDate ? '#ffffff' : '#000000' }} onClick={() => onDateClick(date)}>
          <text
            style={{
              userSelect: 'none',
            }}
          >{date.getDate()}</text>
          <text
            style={{
              userSelect: 'none',
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}</text>
        </Box>
      ))}
      <ArrowForwardIosIcon onClick={() => onArrowClick('right')} />
    </Box>
  );
}
