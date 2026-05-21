const Tour = require('../models/Tour'); //

class TourFactory {
    /**
     * @param {string} type 
     * @param {Object} data
     * @param {Object} oldTour
     */
    static applyBusinessLogic(type, data, oldTour = null) {
        const tourType = type ? type.toLowerCase() : 'day';
        const finalData = { ...data };

        finalData.type = tourType;

        const defaultNotes = {
            day: 'Bring water, sunscreen, and comfortable walking shoes. Day trip only.',
            package: 'Hotel accommodation included. Please bring your ID/Passport for check-in.',
            promo: 'Special promotion item. Non-refundable once booked.'
        };
        finalData.importantNotes = data.importantNotes || defaultNotes[tourType] || 'Standard tour notes.';

        // handle promotion discount logic
        if (tourType === 'promo') {
            // If the original title of this old data already contained "[PROMO]" and the administrator "did not modify the amount", then skip the discount to prevent unlimited discounting.
            const wasAlreadyPromo = oldTour && oldTour.title && oldTour.title.startsWith('[PROMO]');
            const isPriceUnchanged = oldTour && Number(oldTour.price) === Number(data.price);

            if (wasAlreadyPromo && isPriceUnchanged) {
                // It was originally a promo and the administrator didn't change the price -> keep it as is and don't deduct money again.
                console.log("🛡️ [Factory] Promo already applied, skipping duplicate discount.");
            } else {
                // If the price is newly converted to a promo, or if the administrator enters a new "original price" on the edit page, a 10% discount will be applied.
                const originalPrice = Number(data.price || 0); //
                finalData.price = Math.round(originalPrice * 0.9 * 100) / 100; //
                
                if (data.title && !data.title.startsWith('[PROMO]')) { //
                    finalData.title = `[PROMO] ${data.title}`; //
                }
            }
        }

        return finalData;
    }

    // Call when adding a new trip
    static createTour(type, data) {
        const processedData = this.applyBusinessLogic(type, data);
        return new Tour(processedData);
    }
}

module.exports = TourFactory;