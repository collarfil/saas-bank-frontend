import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { transactionApi } from "../../api/transactionApi";
import { accountApi } from "../../api/accountApi";
import toast from "react-hot-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccountss] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    AccountId: "",
    Type: "",
    Status: "",
    Amount: "",
    Reference: "",
    Narration: "",
    Channel: "",
  });

  const tenantid = localStorage.getItem(tenantid);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountApi.getAll();
      const filteredAccounts = response.data.filter(
        (a) => a.tenantId == tenantId,
      );
      setAccounts(filteredAccounts);
    } catch (error) {
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const handlleCreateTransaction = async (e) => {
    e.AccountId;
  };

  const handleSubmit = async (e) => {};
  const fetchTransactions = async () => {};
};
