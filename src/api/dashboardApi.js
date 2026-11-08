import { accountApi } from "./accountApi";
import { customerApi } from "./customerApi";
import { employeeApi } from "./employeeApi";
import { customerKYCApi } from "./customerKYCApi";

/**
 * Dashboard read model assembled from the existing tenant-scoped APIs.
 * The Axios interceptor supplies the authenticated token and __tenant__ header.
 * Do not add client-side tenant filtering: tenant isolation belongs on the API.
 */

const toArray = (response) => {
  const payload = response?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const loadCollection = async (apiCall) => {
  try {
    const response = await apiCall();

    return {
      data: toArray(response),
      available: true,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      available: false,
      error:
        error?.response?.data?.message || error.message || "Request failed",
    };
  }
};

export const dashboardApi = {
  async getTenantOverview() {
    const [customers, accounts, employees, kyc] = await Promise.all([
      loadCollection(() => customerApi.getAll()),
      loadCollection(() => accountApi.getAll()),
      loadCollection(() => employeeApi.getAll()),
      loadCollection(() => customerKYCApi.getAll()),
    ]);

    return {
      customers,
      accounts,
      employees,
      kyc,

      // These remain unavailable until the backend exposes
      // transaction-list and loan-list endpoints.
      transactions: {
        data: [],
        available: false,
        reason:
          "The current TransactionController has no transaction-list endpoint.",
      },

      loans: {
        data: [],
        available: false,
        reason: "The current LoanController has no loan-list endpoint.",
      },
    };
  },
};

export default dashboardApi;
