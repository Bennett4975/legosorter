import React, { useState } from 'react';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const SearchAddSet = ({ onAddSet }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const searchSets = async () => {
        const res = await fetch(`${BASE_URL}/sets/?search=${query}`, {
            headers: { Authorization: `key ${API_KEY}` },
        });
        const data = await res.json();
        setResults(data.results || []);
    };

    const addSet = async (set) => {

        const res = await fetch(`${BASE_URL}/sets/${set.set_num}/parts/` , {
            headers: { Authorization: `key ${API_KEY}` },
        });
        const partData = await fetchAllParts(set.set_num);
        let totalPieces = 0;

        const parts = {};
        partData.forEach(p => {
            parts[p.part.part_num] = {
                owned: 0,
                quantity: p.quantity
            };
            console.log(p.quantity);
            totalPieces += p.quantity;
            console.log(totalPieces);
        });

        onAddSet({
            set_num: set.set_num,
            name: set.name,
            parts,
            img: set.set_img_url,
            totalPieces,
            ownedPieces: 0,
        });


        setQuery('');
        setResults([]);
    };

    const fetchAllParts = async (setNum) => {
        let allParts = [];
        let url = `${BASE_URL}/sets/${setNum}/parts/`;
        while (url) {
            const res = await fetch(url, {
                headers: { Authorization : `key ${API_KEY}` },
            });
            const data = await res.json();
            allParts = allParts.concat(data.results);
            url = data.next;
        }
        return allParts;
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
                        <button onClick={() => addSet(set)}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchAddSet;