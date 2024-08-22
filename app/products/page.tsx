'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from '../styles/products.module.css';
import Swal from 'sweetalert2';

type Product = {
    id: string;
    productName: string;
    price: number;
    image: string;
    quantity: number;
};

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [notify,setNotify]=useState<boolean>(false);
    const [typeSubmit, setTypeSubmit] = useState<string>('add');
    const [product, setProduct] = useState<Product>({
        id: '',
        productName: '',
        price: 0,
        image: '',
        quantity: 0,
    });

    useEffect(() => {
        axios
            .get('http://localhost:3000/api/products')
            .then((res) => setProducts(res.data))
            .catch((err) => console.log(err));
    }, [products]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotify(false)
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle add/edit product
    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (typeSubmit === 'add') {
            if(products.find(btn=>btn.productName==product.productName)){
               setNotify(true);
            }else{
             axios
                .post('http://localhost:3000/api/products', { ...product, id: Math.floor(Math.random() * 100000000).toString() })
                .then((res) => setProducts([...products, res.data]))
                .catch((err) => console.log(err));
            }

           
        } else {
            axios
                .put(`http://localhost:3000/api/products/${product.id}`, product)
                .then((res) => setProducts(products.map((btn) => (btn.id === product.id ? res.data : btn))))
                .catch((err) => console.log(err));
            setTypeSubmit('add');
        }

        setProduct({
            id: '',
            productName: '',
            price: 0,
            image: '',
            quantity: 0,
        });
    };

    // Handle product edit
    const handleEdit = (id: string) => {
        const productToEdit = products.find((btn) => btn.id === id);
        if (productToEdit) {
            setProduct(productToEdit);
            setTypeSubmit('edit');
        }
    };

    // Handle product delete
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:3000/api/products/${id}`)
                    .then(() => setProducts(products.filter((btn) => btn.id !== id)))
                    .catch((err) => console.log(err));
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            }
        });
    };

    return (
        <div className={styles.container}>
            <table>
                <thead>
                    <tr>
                        <th className={styles.td}>STT</th>
                        <th className={styles.td}>Tên sản phẩm</th>
                        <th className={styles.td}>Hình ảnh</th>
                        <th className={styles.td}>Giá</th>
                        <th className={styles.td}>Số lượng</th>
                        <th className={styles.td}>Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((btn, index) => (
                        <tr key={btn.id}>
                            <td className={styles.td}>{index + 1}</td>
                            <td className={styles.td}>{btn.productName}</td>
                            <td className={styles.td}>
                                <img src={btn.image} alt={btn.productName} style={{width:'100px',height:'80px'}} />
                            </td>
                            <td className={styles.td}>{btn.price}</td>
                            <td className={styles.td}>{btn.quantity}</td>
                            <td className={styles.td}>
                                <div className={styles.tdButton}>
                                <button onClick={() => handleDelete(btn.id)} className={styles.buttonDelete}>
                                    Xóa
                                </button>
                                <button className={styles.buttonEdit} onClick={() => handleEdit(btn.id)}>
                                    Sửa
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form className={styles.form} onSubmit={handleAdd}>
                <h3 className={styles.title}>{typeSubmit === 'add' ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}</h3>
                <label htmlFor="productName">Tên</label>
                <input
                    required
                    onChange={handleChange}
                    name="productName"
                    className={styles.input}
                    value={product.productName}
                    type="text"
                    id="productName"
                />
                {notify&&<p className={styles.nameProduct}>Tên sản phẩm không được trùng</p>}
                <label htmlFor="image">Hình ảnh</label>
                <input onChange={handleChange} required name="image" value={product.image} className={styles.input} type="text" id="image" />
               
                <label htmlFor="quantity">Số lượng</label>
                <input required onChange={handleChange} name="quantity" min={1} value={product.quantity} className={styles.input} type="number" id="quantity" />
                <label htmlFor="price">Giá</label>
                <input required onChange={handleChange} type="number" min={1} className={styles.input} value={product.price} name='price' />
                <button type="submit" className={styles.addButton}>
                    {typeSubmit === 'add' ? 'Thêm mới' : 'Cập nhật'}
                </button>
            </form>
            
        </div>
    );
}
