import React, { useEffect, useState } from 'react';
import AddSet from "../components/AddSet"
import ThemeList from '../components/ThemeList';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const SearchSet = () => {
  const [sets, setSets] = useState({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
    setSets(stored);
  }, []);
  const searchSets = async () => {
    const response = await fetch(`${BASE_URL}/sets/?search=${query}`, {
      headers: { Authorization: `key ${API_KEY}` },
    });
    const data = await response.json();
    setResults(data.results || []);
  };

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

  return (
    <div>
    <h1>Seacrh Set</h1>
    <input 
            type='text'
            placeholder='Search for a set'
            value={query}
            onChange={e => setQuery(e.target.value)}
            />
            <button onClick={searchSets}>Search</button>

            <ul>
                {results.map(set => (
                    <li key={set.set_num}>
                        {set.name} ({set.set_num})
                        <img src={set.set_img_url} alt={set.name} style={{width : '50px'}}/>
                        <AddSet set={set} onAddSet={handleAddSet}/>
                    </li>
                ))}
            </ul>
      <ThemeList/>
    </div>
  );
};

export default SearchSet;
