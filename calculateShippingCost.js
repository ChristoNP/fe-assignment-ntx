function calculateShippingCost(destination, weight, priority) {
    // Validation check input params
    if (destination !== "domestic" && destination !== "international") return "Invalid destination"
    if (weight <= 0) return "Invalid weight"
    const validPriorities = ["standard", "express", "priority"]
    if (!validPriorities.includes(priority)) {
        return "Invalid priority"
    }

    let baseCost = 0
    let additionalCost = 0
    // Domestic shipping cost
    if (destination === "domestic") {
        switch (priority) {
            case "standard":
                baseCost = 5
                break;
            case "express":
                baseCost = 10
                break;
            case "priority":
                baseCost = 20
                break;
        }
        if (weight > 10) {
            additionalCost = 10
        }
    } else if (destination === "international") {
        // International shipping cost
        switch (priority) {
            case "standard":
                baseCost = 15
                break;
            case "express":
                baseCost = 25
                break;
            case "priority":
                baseCost = 50
                break;
        }
        if (weight > 5) {
            additionalCost = 50
        }
    }

    // Total cost
    const totalCost = (baseCost * weight) + additionalCost
    return `$${totalCost}`
}

console.log(calculateShippingCost("domestic", 12, "express"));      // $130
console.log(calculateShippingCost("domestic", 8, "priority"));      // $160
console.log(calculateShippingCost("international", 6, "priority")); // $350
console.log(calculateShippingCost("international", 3, "standard")); // $45
console.log(calculateShippingCost("domestic", -1, "standard"));     // Invalid weight
console.log(calculateShippingCost("local", 5, "standard"));         // Invalid destination
console.log(calculateShippingCost("domestic", 5, "regular"));       // Invalid priority