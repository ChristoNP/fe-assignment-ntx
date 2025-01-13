function calculateTax(income, age, dependents) {
    // Validation checks for input params
    if (typeof income !== "number" || income < 0) return "Invalid income"
    if (typeof age !== "number" || age < 0) return "Invalid age"
    if (typeof dependents !== "number" || dependents < 0) return "Invalid dependents"

    // If age is less than 18, not eligible for tax
    if (age < 18) return "Not eligible for tax"

    // Tax rate based on income
    let taxRate = 0
    if (income <= 10000) {
        taxRate = 0.10
    } else if (income <= 50000) {
        taxRate = 0.20
    } else {
        taxRate = 0.30
    }

    // Recursive function to calculate tax reduction for dependents
    function calculateDependentDeduction(dependentCount, deduction = 0) {
        if (dependentCount <= 0) return deduction // No more dependents
        return calculateDependentDeduction(dependentCount - 1, deduction + 500) // Add $500 per dependent
    }

    // Calculate the initial tax
    let tax = income * taxRate

    // Apply age-based discount if the individual is 65 or older
    if (age >= 65) {
        tax *= 0.80 // Apply 20% discount
    }

    // Deduct tax reduction for dependents
    const totalDeduction = calculateDependentDeduction(dependents)
    tax -= totalDeduction

    // Minimum tax is 0
    return Math.max(tax, 0)
}

console.log(calculateTax(20000, 70, 2)); // 2200
console.log(calculateTax(9000, 25, 0));  // 900
console.log(calculateTax(35000, 25, 0)); // 7000
console.log(calculateTax(-5000, 30, 1)); // Invalid income
console.log(calculateTax(5000, '30', 1)); // Invalid age
console.log(calculateTax(5000, 30, -1)); // Invalid dependents
console.log(calculateTax(30000, 15, 1)); // Not eligible for tax