import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = 'bafdb450b6e173f89d553165ccdf8ecb';
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

const SearchPart = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nums = [11, 8, 3, 20, 6, 37, 5, 14, 21, 49, 9, 19, 67, 15, 12, 51, 52, 53, 54, 55, 13, 27, 59, 60, 61, 65, 69, 70, 71, 72, 73, 25, 26, 40];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let allCategories = [];
        let url = `${BASE_URL}/part_categories/`;

        // Loop through pages
        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `key ${API_KEY}` },
          });
          const data = await res.json();
          allCategories = allCategories.concat(data.results);
          url = data.next;
        }

        setCategories(allCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


if (loading) return <p>Loading...</p>
if (error) return <p>ERROR</p>
  return (
    <div className="container mt-4">
        <h1 className="mb-4">Search Part</h1>
        <div className="row">
          <div className='col-md-6'>
            <h2>Bricks:</h2>
            <ul>
              <li><Link to={`/part/category/11`}>Regular Brick</Link> </li>
              <li><Link to={`/part/category/8`}>Technic Brick</Link> </li>
              <li><Link to={`/part/category/3`}>Sloped Brick</Link> </li>
              <li><Link to={`/part/category/20`}>Round Brick</Link> </li>
              <li><Link to={`/part/category/6`}>Wedged Brick</Link> </li>
              <li><Link to={`/part/category/37`}>Curved Brick</Link></li>
              <li><Link to={`/part/category/5`}>Special Brick</Link> </li>
            </ul>
            <h2>Plates</h2>
            <ul>
              <li><Link to={`/part/category/14`}>Regular Plate</Link></li>
              <li><Link to={`/part/category/21`}>Round Plate/Dishes</Link></li>
              <li><Link to={`/part/category/49`}>Angled Plate</Link></li>
              <li><Link to={`/part/category/9`}>Special Plate</Link></li>
              
            </ul>
            <h2>Tiles</h2>
            <ul>
              <li><Link to={`/part/category/19`}>Regular Tile</Link></li>
              <li><Link to={`/part/category/67`}>Round Tile</Link></li>
              <li><Link to={`/part/category/15`}>Special Tile</Link></li>
            </ul>
          <h2>Technic</h2>
            <ul>
              <li><Link to={`/part/category/12`}>Connectors</Link></li>
              <li><Link to={`/part/category/51`}>Beams</Link></li>
              <li><Link to={`/part/category/52`}>Gears</Link></li>
              <li><Link to={`/part/category/53`}>Pins</Link></li>
              <li><Link to={`/part/category/54`}>Bushes</Link></li>
              <li><Link to={`/part/category/55`}>Special Beams</Link></li>
              <li><Link to={`/part/category/25`}>Steering, Suspension, Engines</Link></li>
              <li><Link to={`/part/category/40`}>Panels</Link></li>
              <li><Link to={`/part/category/26`}>Special</Link></li>
            </ul>
          </div>
          <div className='col-md-6'>
            <h2>Misc</h2>
            <ul>
                {categories.filter((category) => category && category.id && !nums.includes(category.id)).map((category) => (
                    <li key={category.id}><Link to={`/part/category/${category.id}`}>{category.name}</Link></li>
                ))}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default SearchPart;