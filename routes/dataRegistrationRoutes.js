import express from 'express';
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration
} from '../controllers/dataRegistrationController.js';

const router = express.Router();

// Create new data registration
router.post('/', createRegistration);

// Get all data registrations
router.get('/', getAllRegistrations);

// Get single registration by ID
router.get('/:id', getRegistrationById);

// Update data registration
router.put('/:id', updateRegistration);

// Delete data registration
router.delete('/:id', deleteRegistration);

export default router;
