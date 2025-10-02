import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCachedParts, setCachedParts } from "../utils/cache";

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';
const TILES = [
    "3070a",
    "3070b",
    "3068b",
    "63864",
    "2431",
    "6636",
    "4162",
    "14719",
    "3068a",
    "3068b",
    "26603",
    "87079",
    "69729",
    "1751",
    "10202",
    "6881b",
    "90498",
    "48288"
]
// CATEGORY 19 (TILES) CONTAINS TOO MANY PRINTED PARTS TO FETCH ALL AND FILTER FROM THE API
// DUE TO THIS I HAD TO HARDCODE FOR EACH DEFAULT TILE
const PartsByCategory = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const cached = getCachedParts(19);
    if (cached) {
      setParts(cached);
      setLoading(false);
      return;
    }

    const fetchParts = async () => {
      try {
        const results = await Promise.all(
            TILES.map(async (partNum) => {
                const response = await fetch(`${BASE_URL}/parts/${partNum}/`, {
                    headers: {Authorization: `key ${API_KEY}` },
                });
                if (!response.ok) throw new Error(`Failed to load ${partNum}`);
                return response.json();
            })
        );
        setParts(results);
        setCachedParts(19, results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Parts in Category 19</h2>
      <ul>
        {parts.map(part => (
          <li key={part.part_num}>
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