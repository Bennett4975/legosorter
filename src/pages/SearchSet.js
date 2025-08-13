import React, { useEffect, useState } from 'react';
import AddSet from '../components/SearchAddSet';
import SetList from '../components/UserSetList';
import ThemeList from '../components/ThemeList';

const SearchSet = () => {
  const [sets, setSets] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
    setSets(stored);
  }, []);

  const handleAddSet = (newSet) => {
    const updated = {
      ...sets,
      [newSet.set_num]: {
        name: newSet.name,
        parts: newSet.parts,
        img: newSet.img,
        totalPieces: newSet.totalPieces,
        ownedPieces: newSet.ownedPieces,
      },
    };
    setSets(updated);
    localStorage.setItem('legoInventory', JSON.stringify(updated));
  };

  const handleRemoveSet = (setNum) => {
    const updated = { ...sets };
    delete updated[setNum];
    setSets(updated);
    localStorage.setItem('legoInventory', JSON.stringify(updated));
  };

  return (
    <div>
      <h1>Bennett's Lego Builder</h1>
      <AddSet onAddSet={handleAddSet} />
      <ThemeList/>

    </div>
  );
};

export default SearchSet;
