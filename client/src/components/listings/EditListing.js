import React, { useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { ListingsContext } from '../../context/ListingsContext';

const EditListing = () => {

    const { categories, setCategories } = useContext(ListingsContext);
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [formValue, setFormValue] = useState(null);
    const [price, setPrice] = useState(null);
    const [image, setImage] = useState("");

    const history = useHistory();

    const fetchCategoryData = useCallback(
        async () => {
            const resCat = await axios.get('http://localhost:5000/api/listings/categories');
            setCategories(resCat.data);
        },
        [setCategories],
    );

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    const fetchData = useCallback(
        async () => {
            const res = await axios.get(`http://localhost:5000/api/listings/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
            setCurrentEdit(res.data[0]);
        },
        [setCurrentEdit, id, token],
    );
    useEffect(() => {
        if (token) {
            fetchData(token);
        }
    }, [token, fetchData]);

    useEffect(() => {
        if (currentEdit?.c_id && currentEdit?.title && currentEdit?.details?.description && currentEdit?.price?.day && currentEdit?.details?.images) {

            const { c_id } = currentEdit;
            const { title } = currentEdit;
            const { description } = currentEdit.details;
            const { images } = currentEdit.details;
            const price = currentEdit.price.day;
            setFormValue({ title, description, c_id });
            setPrice(price);
            setImage(images);
        }
    }, [setFormValue, currentEdit])

    const editData = async (data) => {
        try {
            const res = await axios({
                method: 'POST',
                url: `http://localhost:5000/api/listings/${id}`,
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                data: data
            });
            if (res.status === 201) {
                setCurrentEdit(res.data)
            }
        } catch (err) {
            return ('err:', err);
        }
    };

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "rentify");
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/ddenalelw/image/upload",
            { method: "POST", body: data }
        );
        const file = await res.json();
        setImage(file.secure_url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await editData({
            ...currentEdit,
            category: formValue.c_id,
            title: formValue.title,
            details: {
                ...currentEdit.details,
                description: formValue.description,
                images: [image],
            },
            price: {
                ...currentEdit.price,
                day: price
            }
        });
        history.push('/profile');
    }


    const editListingInput = e => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const editPrice = e => {
        const { value } = e.target;
        setPrice(value);
    };

    return (
        <form onSubmit={handleSubmit} >
            <h3 className='add-listing__sub-title'>Choose category for your listing</h3>
            <select
                className='add-listing__select'
                name='c_id'
                onChange={editListingInput}
                value={formValue?.c_id || ''}>
                {categories && categories.map(a =>
                    <option value={a.c_id} key={a.c_id}>
                        {a.category}
                    </option>
                )}
            </select>
            <br />
            <label htmlFor='title' className='add-listing__label'>Title for your listing</label>
            <input
                type='text'
                name='title'
                value={formValue?.title || ''}
                onChange={editListingInput}
                className='add-listing__input'
                autoComplete='off'
                required="required"
            />
            <br />
            <label htmlFor='description' className='add-listing__label'>Description</label>
            <textarea
                name='description'
                value={formValue?.description || ''}
                onChange={editListingInput}
                className='add-listing__textarea'
                required="required"
            />
            <br />
            <label htmlFor='priceperday' className='add-listing__label'>Price per day</label>
            <input
                type='number'
                name='pricePerDay'
                value={price || ''}
                onChange={editPrice}
                className='add-listing__input'
                autoComplete='off'
                required="required"
            />
            <br />
            <h4>Upload New Image</h4>
            <input
                type="file"
                name="file"
                placeholder="Upload New Image"
                onChange={uploadImage}
            />
            <img src={image} alt={image} style={{ width: "300px" }} />
            <br />
            <div>
                <button type='submit' className='button'>Save</button>
            </div>
        </form>


    )
}

export default EditListing;
