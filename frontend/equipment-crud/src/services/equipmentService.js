import api from './api';

// Get all equipment
export const getEquipment = () => api.get('/equipment/');

// Get one equipment by ID
export const getEquipmentById = (id) => api.get(`/equipment/${id}`);

// Create new equipment
export const createEquipment = (data) => api.post('/equipment/', data);

// Update equipment
export const updateEquipment = (id, data) => api.put(`/equipment/${id}`, data);

// Delete equipment
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);
