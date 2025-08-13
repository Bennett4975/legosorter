import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const PartsByCategory = ( ) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState({});
  const { category } = useParams()

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
        let allParts = [];
        let url = `${BASE_URL}/parts/?part_cat_id=${category}&inc_part_details=1`;

        // Loop through pages
        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `key ${API_KEY}` },
          });
          const data = await res.json();
          allParts = allParts.concat(data.results);
          url = data.next;
        }
        const filteredParts = allParts
        .filter(part => part.print_of === null) // Exclude printed parts
        .reduce((acc, part) => {
            const key = part.name.toLowerCase().replace(/\s*\(.*\)/, '').trim(); // Normalize name
            if (!acc.map.has(key)) {
            acc.map.set(key, true);
            acc.list.push(part);
            }
            return acc;
        }, { list: [], map: new Map() }).list;
        setParts(filteredParts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
    console.log(category);
    }, [category]);

  return parts ? ( 
    <div>
        <h2>Parts in Category {category}</h2>
        <ul>
            {parts.map((part) => (
                <li key={part.part_num}><h3><Link to={`/part/${part.part_num}`}>{part.name} ({part.part_num})</Link></h3>
                <img src={part.part_img_url} alt={part.name} style={{width : '150px'}}/>
                </li>
            ))}
        </ul>
    </div>
  ) : (<p> loading... </p>)
};

export default PartsByCategory; 