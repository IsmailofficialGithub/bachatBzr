export function applyDiscount(actualPrice: number, discount: number): number {
    if (discount < 0 || discount > 100) {
        throw new Error("Discount must be between 0 and 100.");
    }

    const discountAmount = (actualPrice * discount) / 100;
    const newPrice = actualPrice - discountAmount;

    return Math.round(newPrice); // Round off to the nearest integer
}
