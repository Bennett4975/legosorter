import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserSetList.css';

const UserSetList = ({ sets, onRemoveSet }) => {
    console.log(sets);

    if (!sets || Object.keys(sets).length === 0) {
        return <p> No LEGO sets added. </p>
    }

    return (
        <div className="set-list">
            <h2>Your LEGO Sets</h2>
            <ul className="set-grid">
            {Object.entries(sets).map(([setNum, setData]) => (
                <li key={setNum} className="set-item">
                <h3><Link to={`/set/${setNum}/`}>{setData.name} ({setNum})</Link></h3>
                {setData.img && (
                    <img
                    src={setData.img}
                    alt={setData.name}
                    style={{ width: '150px' }}
                    />
                )}
                <p>{setData.ownedPieces ?? 0} / {setData.totalPieces ?? 0} pieces</p>
                <h5>{((setData.ownedPieces / setData.totalPieces) * 100).toFixed(0)}% complete </h5>
                <button onClick={() => onRemoveSet(setNum)}>Remove</button>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default UserSetList;