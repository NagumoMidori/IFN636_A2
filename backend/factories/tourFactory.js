const Tour = require('../models/Tour'); //

class TourFactory {

    static applyBusinessLogic(type, data) {
        const tourType = type ? type.toLowerCase() : 'day';
        const finalData = { ...data };

        // 1. The only restriction types are day and promo
        finalData.type = tourType === 'promo' ? 'promo' : 'day';

        // 2. Based on the type, inject the corresponding preset precautions
        const defaultNotes = {
            day: 'Bring water, sunscreen, and comfortable walking shoes. Day trip only.',
            promo: 'Special promotion item. Non-refundable once booked.'
        };
        finalData.importantNotes = data.importantNotes || defaultNotes[finalData.type] || 'Standard tour notes.';

        return finalData;
    }

    // when add new tour
    static createTour(type, data) {
        const processedData = this.applyBusinessLogic(type, data);
        return new Tour(processedData); 
    }
}

module.exports = TourFactory;