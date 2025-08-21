import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddSet from './AddSet';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const PartsByCategoryList = ( {category} ) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
    setInventory(stored);
  }, []);

  const handleAddSet = (newSet) => {
    const updated = {
      ...inventory,
      [newSet.set_num]: newSet,
    };
    setInventory(updated);
    localStorage.setItem('legoInventory', JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchParts = async () => {
      try {
        let allSets = [];
        let url = `${BASE_URL}/sets/?theme_id=${theme}`;

        // Loop through pages
        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `key ${API_KEY}` },
          });
          const data = await res.json();
          allSets = allSets.concat(data.results);
          url = data.next;
        }

        setSets(allSets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  return (
    <div>
        <h2>Sets</h2>
        <ul>
            {sets.map((set) => (
                <li key={set.set_num}><h3>{set.name} ({set.set_num})</h3>
                <img src={set.set_img_url} alt={set.name} style={{width : '150px'}}/>
                <AddSet set={set} onAddSet={handleAddSet}/>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default PartsByCategoryList;