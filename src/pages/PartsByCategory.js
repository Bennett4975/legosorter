import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCachedParts, setCachedParts } from "../utils/cache";

import "../styles/PartsByCategory.css"

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';


// RETRIES NECESSARY AS SOME LEGO CATEGORIES HAVE THOUSANDS OF ENTRIES
const fetchWithRetry = async (url, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { headers: { Authorization: `key ${API_KEY}` } });
    if (response.status === 429) {
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
      continue;
    }
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
  throw new Error("Too many retries, API still failing");
};

const PartsByCategory = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = getCachedParts(category);
    if (cached) {
      setParts(cached);
      setLoading(false);
      return;
    }

    const fetchParts = async () => {
      try {
        let allParts = [];
        let url = `${BASE_URL}/parts/?part_cat_id=${category}&inc_part_details=1&page_size=50`;

        while (url) {
          const data = await fetchWithRetry(url);
          const filtered = (data.results || [])   // FILTER RESULTS TO GET RID OF ANY PARTS THAT ARE PRINTS
            .filter(p => p && (!p.print_of || p.print_of === null || p.print_of === ""))
          allParts = [...allParts, ...filtered];
          url = data.next;
        }

        // REMOVE UNWANTED ITERATIONS OF LEGO PARTS
        const deduped = allParts.reduce((acc, part) => {
          const key = part.name.toLowerCase().replace(/\s*\(.*\)/, '').trim();
          if (!acc.map.has(key)) {
            acc.map.set(key, true);
            acc.list.push(part);
          }
          return acc;
        }, { list: [], map: new Map() }).list;

        setParts(deduped);
        setCachedParts(category, deduped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Parts in Category {category}</h2>
      <ul className='part-grid'>
        {parts.map(part => (
          <li key={part.part_num} className='part-item'>
            <h3>
              <Link to={`/part/${part.part_num}`}>
                {part.name} ({part.part_num})
              </Link>
            </h3>
            <img src={part.part_img_url} alt={part.name} style={{ width: '150px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartsByCategory;