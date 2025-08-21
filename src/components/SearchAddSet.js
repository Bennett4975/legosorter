import React, { useState } from 'react';
import { useEffect } from 'react';
import AddSet from './AddSet';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const SearchAddSet = ({ onAddSet }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [inventory, setInventory] = useState({});

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('legoInventory')) || {};
        setInventory(stored);
    }, []);
    const searchSets = async () => {
        const res = await fetch(`${BASE_URL}/sets/?search=${query}`, {
            headers: { Authorization: `key ${API_KEY}` },
        });
        const data = await res.json();
        setResults(data.results || []);
    };

    const handleAddSet = (newSet) => {
        const updated = {
        ...inventory,
        [newSet.set_num]: newSet,
        };
        setInventory(updated);
        localStorage.setItem('legoInventory', JSON.stringify(updated));
    };

    return (
        <div>
            <h2>Add an owned LEGO Set</h2>
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
        </div>
    );
};

export default SearchAddSet;