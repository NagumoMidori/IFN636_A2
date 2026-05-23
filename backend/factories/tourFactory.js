const Tour = require('../models/Tour'); //

class TourFactory {
    static normalizeType(type) {
        if (type === undefined || type === null || type === '') return undefined;

        const normalizedType = String(type).toLowerCase();
        if (!['day', 'promo'].includes(normalizedType)) {
            throw new Error('Invalid tour type');
        }

        return normalizedType;
    }

    // If the front-end does not provide a type, no preset value will be inserted.
    static applyUpdateData(type, data) {
        const normalizedType = this.normalizeType(type);
        return normalizedType ? { ...data, type: normalizedType } : { ...data };
    }

    // When adding a new trip, the default value 'day' will only be given if the 'type' field is missing.
    static createTour(type, data) {
        const normalizedType = this.normalizeType(type) || 'day';
        return new Tour({ ...data, type: normalizedType });
    }
}

module.exports = TourFactory;