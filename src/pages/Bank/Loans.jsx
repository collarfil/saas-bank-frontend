// src/pages/Bank/Loans.jsx
import React, { useState, useEffect } from 'react';
import { loanApi } from '../../api/loanApi';
import { customerApi } from '../../api/customerApi';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [loanApplication, setLoanApplication] = useState({
        tenantId: localStorage.getItem('tenantId'),
        customerId: '',
        loanProductId: 1,
        principal: ''
    });

    useEffect(() => {
        fetchCustomers();
        fetchLoans();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerApi.getAll();
            const tenantId = localStorage.getItem('tenantId');
            const filteredCustomers = response.data.filter(c => c.tenantId == tenantId);
            setCustomers(filteredCustomers);
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    const fetchLoans = async () => {
        // You'll need a GET endpoint for loans
        // This is placeholder - implement based on your API
        setLoading(false);
    };

    const handleApplyLoan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loanApi.apply({
                tenantId: parseInt(loanApplication.tenantId),
                customerId: parseInt(loanApplication.customerId),
                loanProductId: loanApplication.loanProductId,
                principal: parseFloat(loanApplication.principal)
            });
            toast.success('Loan application submitted');
            setModalOpen(false);
            fetchLoans();
        } catch (error) {
            toast.error('Failed to submit loan application');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveLoan = async (loanId) => {
        try {
            await loanApi.approve(loanId);
            toast.success('Loan approved');
            fetchLoans();
        } catch (error) {
            toast.error('Failed to approve loan');
        }
    };

    const handleDisburseLoan = async (loanId) => {
        try {
            await loanApi.disburse(loanId);
            toast.success('Loan disbursed');
            fetchLoans();
        } catch (error) {
            toast.error('Failed to disburse loan');
        }
    };

    const handleRepayment = async (e) => {
        e.preventDefault();
        try {
            await loanApi.repay({
                loanId: selectedLoan.id,
                amount: parseFloat(repaymentAmount)
            });
            toast.success('Repayment successful');
            setSelectedLoan(null);
            fetchLoans();
        } catch (error) {
            toast.error('Failed to process repayment');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Loan Management</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Apply for Loan
                </button>
            </div>

            {/* Loan Application Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Apply for Loan"
            >
                <form onSubmit={handleApplyLoan} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Customer</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={loanApplication.customerId}
                            onChange={(e) => setLoanApplication({...loanApplication, customerId: e.target.value})}
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
                        <label className="block text-sm font-medium mb-1">Loan Product</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={loanApplication.loanProductId}
                            onChange={(e) => setLoanApplication({...loanApplication, loanProductId: parseInt(e.target.value)})}
                        >
                            <option value="1">Standard Loan (12% interest)</option>
                            <option value="2">Business Loan (15% interest)</option>
                            <option value="3">Emergency Loan (18% interest)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Principal Amount (₦)</label>
                        <input
                            type="number"
                            required
                            min="1000"
                            className="w-full border rounded-lg px-3 py-2"
                            value={loanApplication.principal}
                            onChange={(e) => setLoanApplication({...loanApplication, principal: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Loans Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Payable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td className="px-6 py-4 text-sm">{loan.id}</td>
                                    <td className="px-6 py-4 text-sm">{loan.customerName}</td>
                                    <td className="px-6 py-4 text-sm">₦{loan.principal?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">₦{loan.interest?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">₦{loan.totalPayable?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            loan.status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
                                            loan.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                            loan.status === 'Disbursed' ? 'bg-green-100 text-green-800' :
                                            loan.status === 'Repaid' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        {loan.status === 'Applied' && (
                                            <button
                                                onClick={() => handleApproveLoan(loan.id)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {loan.status === 'Approved' && (
                                            <button
                                                onClick={() => handleDisburseLoan(loan.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Disburse
                                            </button>
                                        )}
                                        {loan.status === 'Disbursed' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedLoan(loan);
                                                    setRepaymentAmount('');
                                                }}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                Repay
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Repayment Modal */}
            {selectedLoan && (
                <Modal
                    isOpen={!!selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                    title={`Repayment for Loan #${selectedLoan.id}`}
                >
                    <form onSubmit={handleRepayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Outstanding Balance: ₦{selectedLoan.outstandingBalance?.toLocaleString()}
                            </label>
                            <input
                                type="number"
                                required
                                min="100"
                                max={selectedLoan.outstandingBalance}
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Enter repayment amount"
                                value={repaymentAmount}
                                onChange={(e) => setRepaymentAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedLoan(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Make Repayment
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Loans;