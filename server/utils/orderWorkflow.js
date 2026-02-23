/**
 * Centralized State Transition Map for Purchase Orders
 * Defines which state can transition to which next state and who can trigger it.
 */
const PO_STATUS = {
    CREATED: 'Created',
    APPROVED: 'Approved',
    DELIVERED: 'Delivered',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled'
};

const ROLES = {
    ADMIN: 'Admin',
    STAFF: 'Staff',
    VENDOR: 'Vendor'
};

const TRANSITION_MAP = {
    [PO_STATUS.CREATED]: {
        nextStates: [PO_STATUS.APPROVED, PO_STATUS.CANCELLED],
        allowedRoles: [ROLES.ADMIN] // Only admin can approve
    },
    [PO_STATUS.APPROVED]: {
        nextStates: [PO_STATUS.DELIVERED, PO_STATUS.CANCELLED],
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    [PO_STATUS.DELIVERED]: {
        nextStates: [PO_STATUS.CLOSED],
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    [PO_STATUS.CLOSED]: {
        nextStates: [], // Terminal state
        allowedRoles: []
    },
    [PO_STATUS.CANCELLED]: {
        nextStates: [], // Terminal state
        allowedRoles: []
    }
};

/**
 * Validates if a transition is allowed based on current status and user role.
 * @param {string} currentStatus - The current status of the PO
 * @param {string} nextStatus - The status to transition to
 * @param {string} userRole - The role of the user requesting the change
 * @returns {Object} { isValid, message }
 */
const validateTransition = (currentStatus, nextStatus, userRole) => {
    const rules = TRANSITION_MAP[currentStatus];

    if (!rules) {
        return { isValid: false, message: `Invalid current status: ${currentStatus}` };
    }

    if (!rules.nextStates.includes(nextStatus)) {
        return {
            isValid: false,
            message: `Transition from ${currentStatus} to ${nextStatus} is not allowed.`
        };
    }

    if (!rules.allowedRoles.includes(userRole)) {
        return {
            isValid: false,
            message: `User with role ${userRole} is not authorized to move order to ${nextStatus}.`
        };
    }

    return { isValid: true, message: 'Valid transition.' };
};

module.exports = {
    PO_STATUS,
    ROLES,
    validateTransition,
    TRANSITION_MAP
};
