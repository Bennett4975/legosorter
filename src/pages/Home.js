import React, { useEffect, useState } from 'react';
import UserSetList from '../components/UserSetList';

const Home = () => {
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
    setInventory(stored);
  }, []);
  
  const handleRemoveSet = (setNum) => {
    const updated = { ...inventory };
    delete updated[setNum];
    setInventory(updated);
    localStorage.setItem('legoInventory', JSON.stringify(updated));
  };

  return (
    <div>
      <UserSetList sets={inventory} onRemoveSet={handleRemoveSet} />
    </div>
  );
};

export default Home;
