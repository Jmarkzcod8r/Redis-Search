import { useState } from 'react';

export default function CarForm() {
  const [hits, setHits] = useState([]);
  console.log('asjdjaSAn')
  const search = async (event) => {
    const q = event.target.value;

    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      console.log('params...', params)
      const res = await fetch('/api/search?' + params);

      const result = await res.json();
      console.log(result);
      setHits(result['cars']);
    }
  };

  return (
    <div>
      <input
        onChange={search}
        type="text"
        placeholder="search cars..."
        className="form-control"
      />

      <ul className="list-group">
        {
          hits.map((hit) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-start flex"
              key={hit.entityId}
            >
            <button className='w-full '>
              <img width="100%" src={hit.image} />

              <div className="ms-2 me-auto">
                <div className="fw-bold">
                  {hit.make} {hit.model}
                </div>
                {hit.description}
              </div>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
