// src/pages/Bank/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { transactionApi } from '../../api/transactionApi';
import { accountApi } from '../../api/accountApi';
import toast from 'react-hot-toast';

const Transactions = () => {
    const [searchParams] = useSearchParams();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(null); // 'deposit', 'withdraw', 'transfer'
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({
        AccountId: searchParams.get('accountId') || '',
        Amount: '',
        Narration: '',
        Pin: '',
        ToAccountNumber: '',
        FromAccountId: '',
        Channel: 'Cash'
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await accountApi.getAll();
            const filteredAccounts = response.data.filter(a => a.tenantId == tenantId && a.status === 'Active');
            setAccounts(filteredAccounts);
        } catch (error) {
            toast.error('Failed to fetch accounts');
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const accountId = searchParams.get('accountId');
            if (accountId) {
                const response = await transactionApi.getAccountTransactions(accountId);
                setTransactions(response.data);
            } else {
                const response = await transactionApi.getAll();
                setTransactions(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionApi.deposit({
                AccountId: parseInt(formData.AccountId),
                Amount: parseFloat(formData.Amount),
                Narration: formData.Narration,
                Channel: formData.Channel
            });
            toast.success('Deposit successful');
            fetchTransactions();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Deposit failed');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionApi.withdraw({
                AccountId: parseInt(formData.AccountId),
                Amount: parseFloat(formData.Amount),
                Pin: formData.Pin,
                Narration: formData.Narration
            });
            toast.success('Withdrawal successful');
            fetchTransactions();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionApi.transfer({
                FromAccountId: parseInt(formData.FromAccountId),
                ToAccountNumber: parseInt(formData.ToAccountNumber),
                Amount: parseFloat(formData.Amount),
                Pin: formData.Pin,
                Narration: formData.Narration
            });
            toast.success('Transfer successful');
            fetchTransactions();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    const handleReverseTransaction = async (transactionId) => {
        const reason = window.prompt('Enter reason for reversal:');
        if (reason) {
            try {
                await transactionApi.reverse(transactionId, reason);
                toast.success('Transaction reversed successfully');
                fetchTransactions();
            } catch (error) {
                toast.error('Failed to reverse transaction');
            }
        }
    };

    const closeModal = () => {
        setModalOpen(null);
        setFormData({
            AccountId: searchParams.get('accountId') || '',
            Amount: '',
            Narration: '',
            Pin: '',
            ToAccountNumber: '',
            FromAccountId: '',
            Channel: 'Cash'
        });
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'reference', label: 'Reference' },
        { 
            key: 'type', 
            label: 'Type',
            format: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            key: 'amount', 
            label: 'Amount',
            format: (value) => `₦${value?.toLocaleString()}`
        },
        { key: 'narration', label: 'Narration' },
        { key: 'channel', label: 'Channel' },
        { 
            key: 'status', 
            label: 'Status',
            format: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value === 'Approved' ? 'bg-green-100 text-green-800' :
                    value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            key: 'created_At', 
            label: 'Date',
            format: (value) => new Date(value).toLocaleString()
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => setModalOpen('deposit')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setModalOpen('withdraw')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={() => setModalOpen('transfer')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Transfer
                    </button>
                </div>
            </div>

            {/* Account Selector */}
            <div className="mb-6">
                <select
                    className="border rounded-lg px-4 py-2"
                    value={formData.AccountId}
                    onChange={(e) => {
                        setFormData({...formData, AccountId: e.target.value});
                        window.location.href = `/bank/transactions?accountId=${e.target.value}`;
                    }}
                >
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.account_Number} - ₦{account.balance?.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            <DataTable
                columns={columns}
                data={transactions}
                loading={loading}
                onView={(transaction) => {
                    // Show transaction details
                    alert(`Transaction Details:\nReference: ${transaction.reference}\nAmount: ₦${transaction.amount}\nType: ${transaction.type}\nStatus: ${transaction.status}\nDate: ${new Date(transaction.created_At).toLocaleString()}`);
                }}
                onDelete={(transaction) => handleReverseTransaction(transaction.id)}
            />

            {/* Deposit Modal */}
            <Modal
                isOpen={modalOpen === 'deposit'}
                onClose={closeModal}
                title="Make Deposit"
            >
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.AccountId}
                            onChange={(e) => setFormData({...formData, AccountId: e.target.value})}
                        >
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.account_Number} - {account.customerName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                        <input
                            type="number"
                            required
                            min="100"
                            step="0.01"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Amount}
                            onChange={(e) => setFormData({...formData, Amount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Channel</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Channel}
                            onChange={(e) => setFormData({...formData, Channel: e.target.value})}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Narration</label>
                        <textarea
                            rows="2"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Narration}
                            onChange={(e) => setFormData({...formData, Narration: e.target.value})}
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
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Process Deposit
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Withdraw Modal */}
            <Modal
                isOpen={modalOpen === 'withdraw'}
                onClose={closeModal}
                title="Make Withdrawal"
            >
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.AccountId}
                            onChange={(e) => setFormData({...formData, AccountId: e.target.value})}
                        >
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.account_Number} - Balance: ₦{account.balance?.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                        <input
                            type="number"
                            required
                            min="100"
                            step="0.01"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Amount}
                            onChange={(e) => setFormData({...formData, Amount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Transaction PIN</label>
                        <input
                            type="password"
                            required
                            maxLength="4"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Pin}
                            onChange={(e) => setFormData({...formData, Pin: e.target.value})}
                            placeholder="Enter 4-digit PIN"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Narration</label>
                        <textarea
                            rows="2"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Narration}
                            onChange={(e) => setFormData({...formData, Narration: e.target.value})}
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
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Process Withdrawal
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Transfer Modal */}
            <Modal
                isOpen={modalOpen === 'transfer'}
                onClose={closeModal}
                title="Transfer Funds"
                size="lg"
            >
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">From Account</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.FromAccountId}
                            onChange={(e) => setFormData({...formData, FromAccountId: e.target.value})}
                        >
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.account_Number} - Balance: ₦{account.balance?.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">To Account Number</label>
                        <input
                            type="number"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.ToAccountNumber}
                            onChange={(e) => setFormData({...formData, ToAccountNumber: e.target.value})}
                            placeholder="Enter destination account number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                        <input
                            type="number"
                            required
                            min="100"
                            step="0.01"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Amount}
                            onChange={(e) => setFormData({...formData, Amount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Transaction PIN</label>
                        <input
                            type="password"
                            required
                            maxLength="4"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Pin}
                            onChange={(e) => setFormData({...formData, Pin: e.target.value})}
                            placeholder="Enter 4-digit PIN"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Narration</label>
                        <textarea
                            rows="2"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.Narration}
                            onChange={(e) => setFormData({...formData, Narration: e.target.value})}
                            placeholder="What's this for?"
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
                            Transfer
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Transactions;