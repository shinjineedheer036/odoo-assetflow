const router = require('express').Router();
const {
    createAllocation,
    getAllocations,
    getAllocationById,
    updateAllocation,
    deleteAllocation,
} = require('../controllers/allocation.controller');

router.post('/', createAllocation);
router.get('/', getAllocations);
router.get('/:id', getAllocationById);
router.put('/:id', updateAllocation);
router.delete('/:id', deleteAllocation);

module.exports = router;
