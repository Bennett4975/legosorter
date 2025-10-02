import React, { useEffect, useState } from 'react';
import UserSetList from '../components/UserSetList';

const Home = () => {
  const [inventory, setInventory] = useState({});
  // RETREIVE ALL SETS CURRENTLY IN THE INVENTORY
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
    setInventory(stored);
  }, []);
  // LOOKUP A SET NUMBER AND DELETE IT FROM THE INVENTORY
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
