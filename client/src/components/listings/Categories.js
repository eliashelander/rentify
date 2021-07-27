import React, { useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { ListingsContext } from '../../context/ListingsContext';
import './style/Categories.css';

const Categories = () => {
    const {
        categories,
        setCategories
    } = useContext(ListingsContext);

    const fetchData = useCallback(
        async () => {
            const res = await axios.get('http://localhost:5000/api/listings/categories');
            const withCheckStatus = res.data.map((c) => (
                {
                    ...c,
                    checked: false
                }
            ));
            setCategories(withCheckStatus);
        },
        [setCategories],
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (idx) => {
        const updatedCheckValues = categories.map((c) => c);
        updatedCheckValues[idx] = {
            ...updatedCheckValues[idx],
            checked: !updatedCheckValues[idx].checked
        }
        setCategories(updatedCheckValues);
    };

    return (
        <>
            {categories &&
                <div className='categories'>
                    {categories.map((c, idx) => (
                        <label key={c.c_id} htmlFor={c.category} className='categories__category'>
                            <input
                                type="checkbox"
                                name={c.category}
                                checked={c.checked || false}
                                onChange={() => handleChange(idx)}
                                className='categories__checkbox'
                            />
                            {c.category}
                        </label>
                    )
                    )}
                </div>
            }
        </>
    )
}

export default Categories
