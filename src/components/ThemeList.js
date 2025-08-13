import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const ThemeList = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        let allThemes = [];
        let url = `${BASE_URL}/themes/`;

        // Loop through pages
        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `key ${API_KEY}` },
          });
          const data = await res.json();
          allThemes = allThemes.concat(data.results);
          url = data.next;
        }

        setThemes(allThemes.filter(theme => theme.parent_id === null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <div>
        <h2>All Themes</h2>
        <ul>
            {themes.map((theme) => (
                <li key={theme.id}><Link to={`/set/theme/${theme.id}`}>{theme.name}</Link></li>
            ))}
        </ul>
    </div>
  );
};

export default ThemeList;
