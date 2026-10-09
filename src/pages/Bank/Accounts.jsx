// src/pages/Bank/Accounts.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { accountApi } from '../../api/accountApi';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [accountTypes, setAccountTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({
        CustomerId: '',
        Account_TypeId: '',
        InitialDeposit: ''
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchCustomers();
        fetchAccountTypes();
        fetchAccounts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerApi.getAll();
            const filteredCustomers = response.data.filter(c => c.tenantId == tenantId);
            setCustomers(filteredCustomers);
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    const fetchAccountTypes = async () => {
        try {
            // You'll need to implement account types API
            const response = await accountApi.getTypes();
            setAccountTypes(response.data);
        } catch (error) {
            toast.error('Failed to fetch account types');
        }
    };

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await accountApi.getAll();
            const filteredAccounts = response.data.filter(a => a.tenantId == tenantId);
            setAccounts(filteredAccounts);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await accountApi.create({
                CustomerId: parseInt(formData.CustomerId),
                Account_TypeId: parseInt(formData.Account_TypeId),
                InitialDeposit: parseFloat(formData.InitialDeposit)
            });
            toast.success('Account created successfully');
            fetchAccounts();
            closeModal();
        } catch (error) {
            toast.error('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (accountId, status) => {
        try {
            await accountApi.updateStatus(accountId, status);
            toast.success(`Account ${status.toLowerCase()} successfully`);
            fetchAccounts();
        } catch (error) {
            toast.error('Failed to update account status');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormData({
            CustomerId: '',
            Account_TypeId: '',
            InitialDeposit: ''
        });
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'account_Number', label: 'Account Number', sortable: true },
        { 
            key: 'customerId', 
            label: 'Customer',
            format: (value, row) => {
                const customer = customers.find(c => c.id === value);
                return customer ? `${customer.firstName} ${customer.lastName}` : value;
            }
        },
        { 
            key: 'account_TypeId', 
            label: 'Account Type',
            format: (value) => {
                const type = accountTypes.find(t => t.id === value);
                return type ? type.name : value;
            }
        },
        { 
            key: 'balance', 
            label: 'Balance',
            format: (value) => `₦${value?.toLocaleString()}`
        },
        { 
            key: 'status', 
            label: 'Status',
            format: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value === 'Active' ? 'bg-green-100 text-green-800' :
                    value === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                    value === 'Suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            key: 'opened_At', 
            label: 'Opened Date',
            format: (value) => new Date(value).toLocaleDateString()
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Accounts Management</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Open New Account
                </button>
            </div>

            {/* Account Statistics */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Accounts</p>
                    <p className="text-2xl font-bold">{accounts.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Active Accounts</p>
                    <p className="text-2xl font-bold text-green-600">
                        {accounts.filter(a => a.status === 'Active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-2xl font-bold text-blue-600">
                        ₦{accounts.reduce((sum, a) => sum + (a.balance || 0), 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Avg Balance</p>
                    <p className="text-2xl font-bold">
                        ₦{(accounts.reduce((sum, a) => sum + (a.balance || 0), 0) / accounts.length || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={accounts}
                loading={loading}
                onView={(account) => setSelectedAccount(account)}
                onEdit={(account) => {
                    // Show status update options
                    const newStatus = window.prompt('Enter new status (Active/Inactive/Suspended/Closed)', account.status);
                    if (newStatus && ['Active', 'Inactive', 'Suspended', 'Closed'].includes(newStatus)) {
                        handleUpdateStatus(account.id, newStatus);
                    }
                }}
            />

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title="Open New Account"
                size="md"
            >
                <form onSubmit={handleCreateAccount} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Customer</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.CustomerId}
                            onChange={(e) => setFormData({...formData, CustomerId: e.target.value})}
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
                        <label className="block text-sm font-medium mb-1">Account Type</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Account_TypeId}
                            onChange={(e) => setFormData({...formData, Account_TypeId: e.target.value})}
                        >
                            <option value="">Select Account Type</option>
                            {accountTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name} - Min Balance: ₦{type.minimum_Balance?.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Initial Deposit (₦)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.InitialDeposit}
                            onChange={(e) => setFormData({...formData, InitialDeposit: e.target.value})}
                            placeholder="Enter initial deposit amount"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Open Account
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Account Details Modal */}
            {selectedAccount && (
                <Modal
                    isOpen={!!selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    title={`Account Details - ${selectedAccount.account_Number}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Account Holder</p>
                                <p className="font-semibold">
                                    {customers.find(c => c.id === selectedAccount.customerId)?.firstName} {' '}
                                    {customers.find(c => c.id === selectedAccount.customerId)?.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Account Type</p>
                                <p className="font-semibold">
                                    {accountTypes.find(t => t.id === selectedAccount.account_TypeId)?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Current Balance</p>
                                <p className="font-semibold text-2xl text-green-600">
                                    ₦{selectedAccount.balance?.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-semibold">{selectedAccount.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Opened Date</p>
                                <p className="font-semibold">
                                    {new Date(selectedAccount.opened_At).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    // Navigate to transactions page
                                    window.location.href = `/bank/transactions?accountId=${selectedAccount.id}`;
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                View Transactions
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Accounts;