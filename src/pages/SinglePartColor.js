import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import "../styles/SinglePart.css"

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';


const SinglePart = () => {
  const { part_num, color } = useParams();
  console.log(color);

  const [part, setPart] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const [ownedSets, setOwnedSets] = useState({});
  const [setsNeedingPart, setSetsNeedingPart] = useState([]);
  const [setsNotNeedingPart, setSetsNotNeedingPart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

    useEffect(() => {
        const fetchPartData = async () => {
            try {
                let url= `${BASE_URL}/parts/${part_num}`;

                const response = await fetch(url, {
                    headers: { Authorization: `key ${API_KEY}`},
                });
                const partData = await response.json();
                setPart(partData);

                const colorResponse = await fetch(`${url}/colors/`, {
                    headers: { Authorization: `key ${API_KEY}`},
                });
                const colorData = await colorResponse.json();
                setColors(colorData.results);
                
                const defaultColor = colorData.results.find(c => c.color_name === color);
                setSelectedColor(defaultColor || null);

                const inventory = JSON.parse(localStorage.getItem('legoInventory')) || {};
                for (const set of Object.values(inventory)) {
                    for (const [key, val] of Object.entries(set.parts)) {
                        if (typeof val === 'number') {
                        set.parts[key] = { owned: val, quantity: 0 }; // default fallback
                        }
                    }
                }
                setOwnedSets(inventory);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPartData();

    }, [part_num, color]);

    useEffect(() => {
        if (!selectedColor) {
            setSetsNeedingPart([]);

            return;
        }

        const findSetsNeedingPart = async () => {
            const needing = [];
            const notNeeding = [];

            const partKey = `${part_num}-${selectedColor.color_id}`;
            console.log(partKey);

            for (const [setNum, setData] of Object.entries(ownedSets)) {
                try {
                    const partInfo = setData.parts?.[partKey];

                    if (partInfo) {
                        const ownedCount = partInfo.owned || 0;
                        const requiredCount = partInfo.quantity || 0;

                    

                        if (ownedCount < requiredCount) {
                            needing.push({
                                set_num: setNum,
                                name: setData.name,
                                needed: requiredCount - ownedCount,
                                totalNeeded: requiredCount,
                                img: setData.img,

                            });
                        }
                        else {
                            notNeeding.push({
                                set_num: setNum,
                                name: setData.name,
                                needed: requiredCount - ownedCount,
                                totalNeeded: requiredCount,
                                img: setData.img,

                            });

                        } 
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            setSetsNeedingPart(needing);
            setSetsNotNeedingPart(notNeeding);
            
        };

        findSetsNeedingPart();
    }, [selectedColor, ownedSets, part_num]);

    const handleColorSelect = (e) => {
        const colorId = parseInt(e.target.value);
        const color = colors.find((c) => c.color_id === colorId);
        setSelectedColor(color || null);
    }

    const handleContribute = (setNum) => {
        const partKey = `${part_num}-${selectedColor.color_id}`;
        const updatedSets = {...ownedSets };
        const set = updatedSets[setNum];

        if (!set || !set.parts[partKey]) return;


        console.log(set.parts[partKey].owned);
        set.parts[partKey].owned = (set.parts[partKey].owned || 0) + 1;
        console.log(set.parts[partKey].owned);
        set.ownedPieces = (set.ownedPieces || 0 ) + 1;

        localStorage.setItem('legoInventory', JSON.stringify(updatedSets));

        setOwnedSets(updatedSets);

        
    }
    const handleRemoval = (setNum) => {
        const partKey = `${part_num}-${selectedColor.color_id}`;
        const updatedSets = {...ownedSets };
        const set = updatedSets[setNum];

        if (!set || !set.parts[partKey]) return;


        console.log(set.parts[partKey].owned);
        set.parts[partKey].owned =  Math.max(0, (set.parts[partKey].owned || 0) - 1);
        console.log(set.parts[partKey].owned);
        set.ownedPieces = Math.max(0, (set.ownedPieces || 0 ) - 1);

        localStorage.setItem('legoInventory', JSON.stringify(updatedSets));

        setOwnedSets(updatedSets);

        
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!part) return <p>Part not found.</p>;

    return (
        <div className='part-container'>
            <h2>{part.name}</h2>
            <img src={part.part_img_url} alt={part.name} style={{width : '200px'}}/>
            <h3>Select a color:</h3>
            <select onChange={handleColorSelect} defaultValue="">
                <option value="">Select Color</option>
                {colors.map((c) => (
                    <option key={c.color_id} value={c.color_id}>
                        {c.color_name}
                    </option>
                ))}
            </select>

            {selectedColor && (
                    <>
                    <h3>Unfinished that need this part in {selectedColor.color_name}:</h3>
                    {setsNeedingPart.length > 0 ? (
                        <ul>
                        {setsNeedingPart.map((set) => (
                            <li key={set.set_num} style={{ marginBottom: 12 }}>
                            <img
                                src={set.img}
                                alt={set.name}
                                style={{ width: 80, verticalAlign: 'middle', marginRight: 8 }}
                            />
                            <strong>{set.name} ({set.set_num})</strong> — needs {set.needed} of {set.totalNeeded}
                            <button onClick={() => handleContribute(set.set_num)}
                                style={{ marginLeft: 12 }}
                            >
                                Contribute 1
                            </button>
                            <button className='remove-button' onClick={() => handleRemoval(set.set_num)}
                            
                            style={{ marginLeft: 8 }}
                            disabled={
                                ownedSets[set.set_num]?.parts?.[`${part_num}-${selectedColor.color_id}`]?.owned <= 0
                            }
                            >
                            Remove 1
                            </button>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>No sets require.</p>
                    )}
                    <h3>Completed sets that contain this part in {selectedColor.color_name}:</h3>
                    {setsNotNeedingPart.length > 0 ? (
                        <ul>
                        {setsNotNeedingPart.map((set) => (
                            <li key={set.set_num} style={{ marginBottom: 12 }}>
                            <img
                                src={set.img}
                                alt={set.name}
                                style={{ width: 80, verticalAlign: 'middle', marginRight: 8 }}
                            />
                            <Link to={`/set/${set.set_num}`}>{set.name} ({set.set_num})</Link> — contains {set.totalNeeded}
                            <button onClick={() => handleRemoval(set.set_num)}
                            
                            style={{ marginLeft: 8 }}
                            disabled={
                                ownedSets[set.set_num]?.parts?.[`${part_num}-${selectedColor.color_id}`]?.owned <= 0
                            }
                            >
                            Remove 1
                            </button>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>All your sets have this part/color complete! 🎉</p>
                    )}
                    </>
                )}
        </div>
    )
};

export default SinglePart;