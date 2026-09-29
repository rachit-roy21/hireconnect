import API from './api';

export const companyService = {
  getCompanies: (params) => API.get('/companies', { params }),
  getCompanyById: (id) => API.get(`/companies/${id}`)
};
