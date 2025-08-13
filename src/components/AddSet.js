import React from 'react';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const AddSet = ({ set, onAddSet }) => {
    if (!set || !set.set_num) return null;

  const fetchAllParts = async (setNum) => {
    let allParts = [];
    let url = `${BASE_URL}/sets/${setNum}/parts/`;
    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `key ${API_KEY}` },
      });
      const data = await res.json();
      allParts = allParts.concat(data.results.filter(p => !p.is_spare));
      url = data.next;
    }

    return allParts;
  };

  const handleAddSet = async () => {
    const partData = await fetchAllParts(set.set_num);
    let totalPieces = 0;
    const parts = {};

    partData.forEach(p => {
      console.log(p.color.id);
      const partKey = `${p.part.part_num}-${p.color.id}`;
      parts[partKey] = {
        owned: 0,
        quantity: p.quantity,
        img: p.part_img_url,
      };
      totalPieces += p.quantity;
    });

    onAddSet({
      set_num: set.set_num,
      name: set.name,
      parts: parts,
      img: set.set_img_url,
      totalPieces,
      ownedPieces: 0,
    });
  };

  return (
    <button onClick={handleAddSet}>
      Add
    </button>
  );
};

export default AddSet;