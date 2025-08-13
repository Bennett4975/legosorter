import React from 'react';

const PetList = ({ parts }) => {
    if (!sets || Object.keys(sets).length === 0) {
        return <p> No LEGO sets added. </p>
    }

    return (
        <div className="part-list">
            <h2>Avail</h2>
            <ul>
                {Object.entries(parts).map(([partNum, partData]) => {
                    const total = Object.keys(partData.parts || {}).length;

                    return (
                        <li key={partNum} className="part-item">
                            <h3>{partData.name} ({setNum})</h3>
                            {setData.img && (
                                <img 
                                    src={setData.img}
                                    alt={setData.name}
                                    style={{ width: '150px'}}
                                />
                            )}
                        </li>
                    );
                    <h2>Total: {total}</h2>
                })}
            </ul>
        </div>
    );
};

export default SetList;