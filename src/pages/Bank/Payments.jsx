// src/pages/Bank/Payments.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { paymentApi } from '../../api/paymentApi';
import { subscriptionApi } from '../../api/subscriptionApi';
import toast from 'react-hot-toast';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [formData, setFormData] = useState({
        subscriptionId: '',
        amount: '',
        email: '',
        customerName: '',
        phoneNumber: ''
    });

    const tenantId = localStorage.getItem('tenantId');

    useEffect(() => {
        fetchSubscriptions();
        fetchPayments();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await subscriptionApi.getAll();
            const filteredSubs = response.data.filter(s => s.tenantId == tenantId && s.isActive);
            setSubscriptions(filteredSubs);
        } catch (error) {
            toast.error('Failed to fetch subscriptions');
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await paymentApi.getHistory();
            setPayments(response.data);
        } catch (error) {
            toast.error('Failed to fetch payment history');
        } finally {
            setLoading(false);
        }
    };

    const handlePaystackPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await paymentApi.initializePaystack({
                subscriptionId: parseInt(formData.subscriptionId),
                amount: parseFloat(formData.amount),
                email: formData.email,
                tenantId: parseInt(tenantId),
                callbackUrl: `${window.location.origin}/payment/callback`
            });
            
            // Redirect to Paystack
            window.location.href = response.data.authorizationUrl;
        } catch (error) {
            toast.error('Failed to initialize Paystack payment');
            setLoading(false);
        }
    };

    const handleFlutterwavePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await paymentApi.initializeFlutterwave({
                subscriptionId: parseInt(formData.subscriptionId),
                amount: parseFloat(formData.amount),
                email: formData.email,
                customerName: formData.customerName,
                phoneNumber: formData.phoneNumber,
                tenantId: parseInt(tenantId),
                redirectUrl: `${window.location.origin}/payment/callback`
            });
            
            // Redirect to Flutterwave
            window.location.href = response.data.link;
        } catch (error) {
            toast.error('Failed to initialize Flutterwave payment');
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedGateway(null);
        setFormData({
            subscriptionId: '',
            amount: '',
            email: '',
            customerName: '',
            phoneNumber: ''
        });
    };

    const handleSubscriptionSelect = (subscriptionId) => {
        const subscription = subscriptions.find(s => s.id === parseInt(subscriptionId));
        if (subscription) {
            setFormData({
                ...formData,
                subscriptionId: subscriptionId,
                amount: subscription.amount
            });
        }
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { 
            key: 'subscriptionId', 
            label: 'Subscription',
            format: (value) => {
                const sub = subscriptions.find(s => s.id === value);
                return sub ? sub.planName : value;
            }
        },
        { 
            key: 'amount', 
            label: 'Amount',
            format: (value) => `₦${value?.toLocaleString()}`
        },
        { key: 'transactionReference', label: 'Transaction Reference' },
        { 
            key: 'isSuccessful', 
            label: 'Status',
            format: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value ? 'Successful' : 'Failed'}
                </span>
            )
        },
        { 
            key: 'createdAt', 
            label: 'Date',
            format: (value) => new Date(value).toLocaleString()
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Payment Management</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => {
                            setSelectedGateway('paystack');
                            setModalOpen(true);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Pay with Paystack
                    </button>
                    <button
                        onClick={() => {
                            setSelectedGateway('flutterwave');
                            setModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Pay with Flutterwave
                    </button>
                </div>
            </div>

            {/* Payment Statistics */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Successful Payments</p>
                    <p className="text-2xl font-bold text-green-600">
                        {payments.filter(p => p.isSuccessful).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total Amount Paid</p>
                    <p className="text-2xl font-bold text-blue-600">
                        ₦{payments.filter(p => p.isSuccessful).reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={payments}
                loading={loading}
            />

            {/* Payment Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={selectedGateway === 'paystack' ? 'Pay with Paystack' : 'Pay with Flutterwave'}
                size="lg"
            >
                <form onSubmit={selectedGateway === 'paystack' ? handlePaystackPayment : handleFlutterwavePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Subscription</label>
                        <select
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.subscriptionId}
                            onChange={(e) => handleSubscriptionSelect(e.target.value)}
                        >
                            <option value="">Select Subscription Plan</option>
                            {subscriptions.map(sub => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.planName} - ₦{sub.amount?.toLocaleString()} ({new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                        <input
                            type="number"
                            required
                            readOnly
                            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                            value={formData.amount}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="customer@example.com"
                        />
                    </div>

                    {selectedGateway === 'flutterwave' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    placeholder="08012345678"
                                />
                            </div>
                        </>
                    )}

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
                            {loading ? 'Processing...' : `Pay ₦${parseFloat(formData.amount || 0).toLocaleString()}`}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Payments;