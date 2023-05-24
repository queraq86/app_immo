import React, { useEffect, useState } from 'react';

const PropertyPage = () => {
    const [properties, setProperties] = useState([]);
    const [newPropName, setnewPropName] = useState('');
    const [newPropAddress, setnewPropAddress] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/properties', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Data is an array
                    setProperties(data);
                } else {
                    // Data is not an array
                    console.log('Data is not an array');
                }
            });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        const newProp = { name: newPropName, address: newPropAddress };

        fetch('http://localhost:8000/properties', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProp),
        })
            .then(response => {
                if (response.ok) {
                    // Successful POST request
                    return response.json();
                } else {
                    // Handle invalid response
                    throw new Error('Failed to create property');
                }
            })
            .then(data => {
                setProperties([...properties, data]);
                setnewPropName('');
                setnewPropAddress('');
                console.log('Property created:', data);
            })
            .catch(error => {
                // Handle error case
                console.error('Error creating property:', error.message);
            });
    };

    const handleDeleteProp = prop => {
        fetch(`http://localhost:8000/properties/${prop.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (response.ok) {
                    // Successful POST request
                    return response.json();
                } else {
                    // Handle invalid response
                    throw new Error('Failed to delete property');
                }
            })
            .then(data => {
                if (data.message === 'Property deleted successfully') {
                    const updatedProperties = properties.filter(u => u.id !== prop.id);
                    setProperties(updatedProperties);
                }
            })
            .catch(error => {
                // Handle error case
                console.error('Error creating property:', error.message);
            });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Your Properties</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter name"
                            value={newPropName}
                            onChange={(e) => setnewPropName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter address"
                            value={newPropAddress}
                            onChange={(e) => setnewPropAddress(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add Property
                    </button>
                </div>
            </form>
            <ul className="list-group">
                {properties.map(prop => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={prop.id}>
                        {prop.name}
                        <button className="btn btn-danger" onClick={() => handleDeleteProp(prop)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PropertyPage;