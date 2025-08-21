import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const SingleSet = () => {
    const { set_id } = useParams();
    const [set, setSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parts, setParts] = useState([]);
    const [spares, setSpares] = useState([]);
    const [ownedData, setOwnedData] = useState(null);
    const [ownedSets, setOwnedSets] = useState({});

    useEffect(() => {
        const fetchSet = async () => {
            try {
                let url = `${BASE_URL}/sets/${set_id}/`;

                const response = await fetch(url, {
                    headers: { Authorization: `key ${API_KEY}` },
                });
                const data = await response.json();
                setSet(data);
                const inventory = JSON.parse(localStorage.getItem('legoInventory'));
                setOwnedSets(inventory);
                const ownedSet = inventory[set_id] || null;
                setOwnedData(ownedSet);
            } catch(err) {
                setError(err.message);
            }
        };

        const fetchParts = async () => {
          try {
            let uniqueParts = [];
            let spareParts = [];
            let url = `${BASE_URL}/sets/${set_id}/parts/`;

            while (url) {
              const response = await fetch(url, {
                headers: { Authorization: `key ${API_KEY}` },
              });
              const data = await response.json();
              uniqueParts = uniqueParts.concat(data.results.filter(p => !p.is_spare));
              spareParts = spareParts.concat(data.results.filter(p => p.is_spare))

              url = data.next;
            } 
            setParts(uniqueParts);
            setSpares(spareParts);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchSet();
        fetchParts();  
    }, [set_id]);

    const handleContribute = (setNum, partKey) => {
        console.log(setNum, partKey);
        const updatedSets = {...ownedSets};
        console.log(updatedSets);
        const set = updatedSets[setNum];

        if (!set || !set.parts[partKey]) return;
        if (set.parts[partKey].owned + 1 > set.parts[partKey].quantity) return;
        console.log(set.parts[partKey]);
        set.parts[partKey].owned = (set.parts[partKey].owned || 0) + 1;
        console.log(set.parts[partKey].owned);
        set.ownedPieces = (set.ownedPieces || 0 ) + 1;

        localStorage.setItem('legoInventory', JSON.stringify(updatedSets));

        setOwnedSets(updatedSets);
    }

    const handleRemoval = (setNum, partKey) => {
      const updatedSets = {...ownedSets};
      const set = updatedSets[setNum];

      if (!set || !set.parts[partKey]) return;
      if (set.parts[partKey].owned - 1 < 0) return;

      set.parts[partKey].owned = (set.parts[partKey].owned || 1) - 1;

      set.ownedPieces = (set.ownedPieces || 0 ) - 1;

      localStorage.setItem('legoInventory', JSON.stringify(updatedSets));

      setOwnedSets(updatedSets);

      
    }


    if (loading) return <p>loading...</p>
    if (error) return <p>{error}</p>
    if (!set || !parts) return

    return (
        <div>
            <h2>{set.name}</h2>
            {ownedData ? (
              <h3>Owned</h3>
            ) : (
              <h3>Not Owned</h3>
            )} 
            <img src={set.set_img_url} alt={set.name} style={{width : '450px'}}/>

            <h3>Missing Parts</h3>
            <ul>
                {parts.map((item) => {
                    const key = `${item.part.part_num}-${item.color.id}`;
                    const partData = ownedData?.parts[key];
                    if (!partData || partData.owned === partData.quantity) {
                      return null;
                    }

                    return (
                    <li key={key}>
                                    <img
                                        src={item.part.part_img_url}
                                        alt={item.part.name}
                                        style={{ width: '40px', verticalAlign: 'middle', marginRight: '8px' }}
                                    />
                                   <Link to={`/part/${item.part.part_num}/${item.color.name}`} > {item.part.name} ({item.color.name}) </Link>
                                   {ownedData && (
                                    <>
                                      <h5>{partData.owned}/{partData.quantity}</h5>
                                      <button onClick={() => handleContribute(ownedData.set_num, key)}
                                        style={{ marginLeft: 12 }}
                                      >
                                      Add 1
                                      </button>
                                      <button onClick={() => handleRemoval(ownedData.set_num, key)}
                                        style={{ marginLeft: 12 }}
                                      >
                                      Remove 1
                                      </button>
                                      
                                    </>
                      
                    )}
                    </li>
                  );
              })}
            </ul>
            <h3>Complete Parts:</h3>
            <ul>
                {parts.map((item) => {
                    const key = `${item.part.part_num}-${item.color.id}`;
                    const partData = ownedData?.parts[key];
                    if (!partData || partData.owned < partData.quantity) {
                      return null;
                    }

                    return (
                    <li key={key}>
                                    <img
                                        src={item.part.part_img_url}
                                        alt={item.part.name}
                                        style={{ width: '40px', verticalAlign: 'middle', marginRight: '8px' }}
                                    />
                                   <Link to={`/part/${item.part.part_num}/${item.color.name}`} > {item.part.name} ({item.color.name}) </Link>
                                   {ownedData && (
                                    <>
                                      <h5>{partData.owned}/{partData.quantity}</h5>
                                      <button onClick={() => handleRemoval(ownedData.set_num, key)}
                                        style={{ marginLeft: 12 }}
                                      >
                                      Remove 1
                                      </button>
                                      
                                    </>
                      
                    )}
                    </li>
                  );
              })}
            </ul>
            <h3>Spare Parts</h3>
            <ul>
                {spares.map((item) => (
                    <li key={`${item.part.part_num}-${item.color.id}`}>
                                    <img
                                        src={item.part.part_img_url}
                                        alt={item.part.name}
                                        style={{ width: '40px', verticalAlign: 'middle', marginRight: '8px' }}
                                    />
                                   <Link to={`/part/${item.part.part_num}/${item.color.name}`} > {item.quantity} x {item.part.name} ({item.color.name}) </Link>
                    </li>
                ))}
            </ul>

        </div>
    )
};

export default SingleSet;