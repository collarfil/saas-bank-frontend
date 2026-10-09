// src/pages/Bank/CustomerAddresses.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { customerAddressApi } from '../../api/customerAddressApi';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

const CustomerAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        CustomerId: '',
        Address: '',
        City: '',
        State: '',
        Country: 'Nigeria'
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchCustomers();
        fetchAddresses();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerApi.getAll();
            const filteredCustomers = tenantId ? response.data.filter(c => c.tenantId == tenantId) : response.data;
            setCustomers(filteredCustomers);
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await customerAddressApi.getAll();
            const filteredAddresses = tenantId ? response.data.filter(a => a.tenantId == tenantId) : response.data;
            setAddresses(filteredAddresses);
        } catch (error) {
            toast.error('Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const addressData = {
                Id: editingAddress?.id || 0,
                TenantId: parseInt(tenantId),
                ...formData,
                CustomerId: parseInt(formData.CustomerId)
            };

            if (editingAddress) {
                await customerAddressApi.upsert(addressData);
                toast.success('Address updated successfully');
            } else {
                await customerAddressApi.upsert(addressData);
                toast.success('Address added successfully');
            }
            fetchAddresses();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            CustomerId: address.customerId,
            Address: address.address || '',
            City: address.city || '',
            State: address.state || '',
            Country: address.country || 'Nigeria'
        });
        setModalOpen(true);
    };

    const handleDelete = async (address) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await customerAddressApi.delete(address.id);
                toast.success('Address deleted successfully');
                fetchAddresses();
            } catch (error) {
                toast.error('Failed to delete address');
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingAddress(null);
        setFormData({
            CustomerId: '',
            Address: '',
            City: '',
            State: '',
            Country: 'Nigeria'
        });
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { 
            key: 'customerId', 
            label: 'Customer',
            format: (value) => {
                const customer = customers.find(c => c.id === value);
                return customer ? `${customer.firstName} ${customer.lastName}` : value;
            }
        },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'country', label: 'Country' }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customer Addresses</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Address
                </button>
            </div>

            {/* Customers List with Address Count */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map(customer => {
                    const customerAddresses = addresses.filter(a => a.customerId === customer.id);
                    return (
                        <div 
                            key={customer.id} 
                            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                            onClick={() => {
                                setFormData({...formData, CustomerId: customer.id});
                                setModalOpen(true);
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{customer.firstName} {customer.lastName}</h3>
                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-blue-600">{customerAddresses.length}</span>
                                    <p className="text-xs text-gray-500">Addresses</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Addresses Table */}
            <DataTable
                columns={columns}
                data={addresses}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={editingAddress ? 'Edit Address' : 'Add New Address'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.CustomerId}
                            onChange={(e) => setFormData({...formData, CustomerId: e.target.value})}
                            disabled={!!editingAddress}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName} - {customer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows="2"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.Address}
                            onChange={(e) => setFormData({...formData, Address: e.target.value})}
                            placeholder="Enter street address"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.City}
                                onChange={(e) => setFormData({...formData, City: e.target.value})}
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.State}
                                onChange={(e) => setFormData({...formData, State: e.target.value})}
                                placeholder="Enter state"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.Country}
                            onChange={(e) => setFormData({...formData, Country: e.target.value})}
                            placeholder="Enter country"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : (editingAddress ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomerAddresses;