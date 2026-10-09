// src/pages/Bank/Ledger.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { ledgerApi } from '../../api/ledgerApi';
import { accountApi } from '../../api/accountApi';
import toast from 'react-hot-toast';

const Ledger = () => {
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({
        entries: [
            { accountId: '', amount: '', entryType: 'Debit' }
        ]
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchAccounts();
        fetchLedgerEntries();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await accountApi.getAll();
            const filteredAccounts = response.data.filter(a => a.tenantId == tenantId);
            setAccounts(filteredAccounts);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const fetchLedgerEntries = async () => {
        setLoading(true);
        try {
            const response = await ledgerApi.getAll();
            const filteredEntries = response.data.filter(l => l.tenantId == tenantId);
            setLedgerEntries(filteredEntries);
        } catch (error) {
            toast.error('Failed to fetch ledger entries');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitLedger = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ledgerApi.submit(formData.entries);
            toast.success('Ledger transaction submitted for approval');
            fetchLedgerEntries();
            closeModal();
        } catch (error) {
            toast.error('Failed to submit ledger transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (transactionId) => {
        try {
            await ledgerApi.approve(transactionId);
            toast.success('Transaction approved');
            fetchLedgerEntries();
        } catch (error) {
            toast.error('Failed to approve transaction');
        }
    };

    const handleReject = async (transactionId) => {
        try {
            await ledgerApi.reject(transactionId);
            toast.success('Transaction rejected');
            fetchLedgerEntries();
        } catch (error) {
            toast.error('Failed to reject transaction');
        }
    };

    const addEntryRow = () => {
        setFormData({
            entries: [...formData.entries, { accountId: '', amount: '', entryType: 'Debit' }]
        });
    };

    const removeEntryRow = (index) => {
        const newEntries = formData.entries.filter((_, i) => i !== index);
        setFormData({ entries: newEntries });
    };

    const updateEntry = (index, field, value) => {
        const newEntries = [...formData.entries];
        newEntries[index][field] = value;
        setFormData({ entries: newEntries });
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormData({
            entries: [{ accountId: '', amount: '', entryType: 'Debit' }]
        });
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { 
            key: 'transactionId', 
            label: 'Transaction ID' 
        },
        { 
            key: 'accountId', 
            label: 'Account',
            format: (value) => {
                const account = accounts.find(a => a.id === value);
                return account ? `${account.account_Number}` : value;
            }
        },
        { 
            key: 'amount', 
            label: 'Amount',
            format: (value) => `₦${value?.toLocaleString()}`
        },
        { 
            key: 'entryType', 
            label: 'Entry Type',
            format: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            key: 'createdAt', 
            label: 'Created Date',
            format: (value) => new Date(value).toLocaleString()
        }
    ];

    // Calculate totals for debit and credit
    const totalDebits = ledgerEntries
        .filter(e => e.entryType === 'Debit')
        .reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const totalCredits = ledgerEntries
        .filter(e => e.entryType === 'Credit')
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">General Ledger</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    New Journal Entry
                </button>
            </div>

            {/* Ledger Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Debits</p>
                    <p className="text-2xl font-bold text-red-600">₦{totalDebits.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Credits</p>
                    <p className="text-2xl font-bold text-green-600">₦{totalCredits.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className={`text-2xl font-bold ${totalDebits - totalCredits >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        ₦{(totalDebits - totalCredits).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Account Selector for Ledger View */}
            <div className="mb-6">
                <select
                    className="border rounded-lg px-4 py-2"
                    value={selectedAccount || ''}
                    onChange={(e) => setSelectedAccount(e.target.value || null)}
                >
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.account_Number} - Balance: ₦{account.balance?.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ledger Entries Table */}
            <DataTable
                columns={columns}
                data={selectedAccount ? ledgerEntries.filter(l => l.accountId === parseInt(selectedAccount)) : ledgerEntries}
                loading={loading}
                onView={(entry) => {
                    // Show entry details
                    alert(`Ledger Entry Details:\nAccount: ${entry.accountId}\nAmount: ₦${entry.amount}\nType: ${entry.entryType}\nDate: ${new Date(entry.createdAt).toLocaleString()}`);
                }}
            />

            {/* New Journal Entry Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title="New Journal Entry"
                size="xl"
            >
                <form onSubmit={handleSubmitLedger} className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Account</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Entry Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount (₦)</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {formData.entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <select
                                                required
                                                className="w-full border rounded-lg px-2 py-1"
                                                value={entry.accountId}
                                                onChange={(e) => updateEntry(index, 'accountId', e.target.value)}
                                            >
                                                <option value="">Select Account</option>
                                                {accounts.map(account => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.account_Number}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                required
                                                className="w-full border rounded-lg px-2 py-1"
                                                value={entry.entryType}
                                                onChange={(e) => updateEntry(index, 'entryType', e.target.value)}
                                            >
                                                <option value="Debit">Debit</option>
                                                <option value="Credit">Credit</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                required
                                                min="0.01"
                                                step="0.01"
                                                className="w-full border rounded-lg px-2 py-1"
                                                value={entry.amount}
                                                onChange={(e) => updateEntry(index, 'amount', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => removeEntryRow(index)}
                                                className="text-red-600 hover:text-red-800"
                                                disabled={formData.entries.length === 1}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        type="button"
                        onClick={addEntryRow}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        + Add Row
                    </button>

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
                            Submit for Approval
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Ledger;