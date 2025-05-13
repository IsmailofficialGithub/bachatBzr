export function applyDiscount(actualPrice: number, discount: number): number {
    if (discount < 0 || discount > 100) {
        return actualPrice
    }

    const discountAmount = (actualPrice * discount) / 100;
    const newPrice = actualPrice - discountAmount;

    return Math.round(newPrice); // Round off to the nearest integer
}
