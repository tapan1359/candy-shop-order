import { Button } from '@mui/material';
import React, { useState } from 'react';

function LoadItem({ buttonTitle, fetchDataFunc }) {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      await fetchDataFunc();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick} disabled={loading}>
        {loading ? 'Loading...' : buttonTitle}
      </Button>
    </div>

  );
}

export default LoadItem;
