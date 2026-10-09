// src/pages/Bank/CustomerKYC.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { customerKYCApi } from '../../api/customerKYCApi';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

const CustomerKYC = () => {
    const [kycRecords, setKycRecords] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingKYC, setEditingKYC] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        CustomerId: '',
        NIN: '',
        BVN: '',
        ID_Type: 'National ID',
        ID_Number: '',
        Passport: ''
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchCustomers();
        fetchKYC();
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

    const fetchKYC = async () => {
        setLoading(true);
        try {
            const response = await customerKYCApi.getAll();
            const filteredKYC = tenantId ? response.data.filter(k => k.tenantId == tenantId) : response.data;
            setKycRecords(filteredKYC);
        } catch (error) {
            toast.error('Failed to fetch KYC records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const kycData = {
                Id: editingKYC?.id || 0,
                TenantId: parseInt(tenantId),
                CustomerId: parseInt(formData.CustomerId),
                NIN: formData.NIN,
                BVN: formData.BVN,
                ID_Type: formData.ID_Type,
                ID_Number: formData.ID_Number,
                Passport: formData.Passport,
                Verfied_At: new Date().toISOString()
            };

            await customerKYCApi.upsert(kycData);
            toast.success(editingKYC ? 'KYC updated successfully' : 'KYC submitted successfully');
            fetchKYC();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (kyc) => {
        setEditingKYC(kyc);
        setFormData({
            CustomerId: kyc.customerId,
            NIN: kyc.nin || '',
            BVN: kyc.bvn || '',
            ID_Type: kyc.id_Type || 'National ID',
            ID_Number: kyc.id_Number || '',
            Passport: kyc.passport || ''
        });
        setModalOpen(true);
    };

    const handleDelete = async (kyc) => {
        if (window.confirm('Are you sure you want to delete this KYC record?')) {
            try {
                await customerKYCApi.delete(kyc.id);
                toast.success('KYC record deleted successfully');
                fetchKYC();
            } catch (error) {
                toast.error('Failed to delete KYC record');
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingKYC(null);
        setFormData({
            CustomerId: '',
            NIN: '',
            BVN: '',
            ID_Type: 'National ID',
            ID_Number: '',
            Passport: ''
        });
    };

    const getKYCStatus = (customerId) => {
        const kyc = kycRecords.find(k => k.customerId === customerId);
        if (!kyc) return { status: 'Pending', color: 'bg-red-100 text-red-800' };
        if (kyc.nin && kyc.bvn && kyc.id_Number) return { status: 'Verified', color: 'bg-green-100 text-green-800' };
        return { status: 'Incomplete', color: 'bg-yellow-100 text-yellow-800' };
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
        { key: 'nin', label: 'NIN' },
        { key: 'bvn', label: 'BVN' },
        { key: 'id_Type', label: 'ID Type' },
        { key: 'id_Number', label: 'ID Number' },
        { 
            key: 'verfied_At', 
            label: 'Verified Date',
            format: (value) => value ? new Date(value).toLocaleDateString() : 'Not Verified'
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customer KYC Management</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Submit KYC
                </button>
            </div>

            {/* KYC Status Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Verified KYC</p>
                    <p className="text-2xl font-bold text-green-600">
                        {kycRecords.filter(k => k.nin && k.bvn && k.id_Number).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Pending KYC</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {customers.length - kycRecords.filter(k => k.nin && k.bvn && k.id_Number).length}
                    </p>
                </div>
            </div>

            {/* Customers KYC Status Table */}
            <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
                <h3 className="text-lg font-semibold p-4 border-b text-gray-800">Customer KYC Status</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map(customer => {
                                const { status, color } = getKYCStatus(customer.id);
                                return (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {customer.firstName} {customer.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    const existingKYC = kycRecords.find(k => k.customerId === customer.id);
                                                    if (existingKYC) {
                                                        handleEdit(existingKYC);
                                                    } else {
                                                        setFormData({...formData, CustomerId: customer.id.toString()});
                                                        setModalOpen(true);
                                                    }
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                {status === 'Pending' ? 'Submit KYC' : 'View/Edit'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={kycRecords}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={editingKYC ? 'Edit KYC Record' : 'Submit KYC Record'}
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
                            disabled={!!editingKYC}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName} - {customer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                NIN (National ID Number)
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.NIN}
                                onChange={(e) => setFormData({...formData, NIN: e.target.value})}
                                placeholder="e.g., 12345678901"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                BVN (Bank Verification Number)
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.BVN}
                                onChange={(e) => setFormData({...formData, BVN: e.target.value})}
                                placeholder="e.g., 22123456789"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Type
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.ID_Type}
                                onChange={(e) => setFormData({...formData, ID_Type: e.target.value})}
                            >
                                <option value="National ID">National ID Card</option>
                                <option value="Driver's License">Driver's License</option>
                                <option value="International Passport">International Passport</option>
                                <option value="Voter's Card">Voter's Card</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Number
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.ID_Number}
                                onChange={(e) => setFormData({...formData, ID_Number: e.target.value})}
                                placeholder="Enter ID number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Passport Photo URL
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.Passport}
                            onChange={(e) => setFormData({...formData, Passport: e.target.value})}
                            placeholder="https://example.com/passport.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload passport photo and provide URL</p>
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
                            {isSubmitting ? 'Processing...' : (editingKYC ? 'Update' : 'Submit')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomerKYC;