
function getQuantityMatching(matchingOrders, incomingOrder) {
  return matchingOrders.filter((currentItem) => {
    const {
      quantity
    } = currentItem
    return quantity === incomingOrder.quantity
  })
}

//order matches in quantity exactly
function handleQuantityMatch(quantityMatch, existingBook) {
  if (quantityMatch.length > 0) {
    for (var i = 0; i < existingBook.length; i++) {
      if (existingBook[i].quantity === quantityMatch[0].quantity) {
        existingBook.splice(i, 1)
        i = existingBook.length
      }
    }
    return existingBook
  }
}

//quanity of matchingOrders is greater than incomingOrders
function getQuantityGreaterThan(matchingOrders, incomingOrder) {
  return matchingOrders.filter((currentItem) => { //returns a array with orders that have quantity greater than icomingOrders
    const {
      quantity
    } = currentItem
    return quantity > incomingOrder.quantity
  })
}

//if there is a remainder
function handleGreaterThan(quantityGreater, existingBook, incomingOrder) {
  if (quantityGreater.length > 0) {
    for (var i = 0; i < existingBook.length; i++) {
      if (existingBook[i].quantity === quantityGreater[0].quantity) {
        existingBook[i].quantity = existingBook[i].quantity - incomingOrder.quantity
        i = existingBook.length
      }
    }
    return existingBook
  }
}

//function if quanity of incomingOrder is less than matchingOrder
function partialFulfillment(matchingOrders, incomingOrder) {
  return matchingOrders.filter((currentItem) => { //returns a array with orders that have 
    const {
      quantity
    } = currentItem
    return quantity < incomingOrder.quantity
  })
}
//gets an order for a beneficial fullfillment
function getBenefitMatches(existingBook, incomingOrder) {
  return existingBook.filter((currentItem) => {
    const {
      type,
      quantity,
      price
    } = currentItem
    return type !== incomingOrder.type && price > incomingOrder.price &&
      price >= incomingOrder.price + 100 && quantity === incomingOrder.quantity
  })
}

//function to partially fulfill Order
function handlePartialFulfillment(quantityLess, existingBook, incomingOrder) {
  if (quantityLess.length > 0) {
    for (var i = 0; i < existingBook.length; i++) {
      if (existingBook[i].quantity === quantityLess[0].quantity) {
        incomingOrder.quantity = incomingOrder.quantity - existingBook[i].quantity
        existingBook.splice(i, 1)
        existingBook.push(incomingOrder)
        i = existingBook.length
      }
    }
    return existingBook
  }
}


// pulls orders that match in price but do not match in type
function getMatchingOrders(existingBook, incomingOrder) {
  return existingBook.filter((currentItem) => {
    const {
      type,
      price
    } = currentItem
    return type !== incomingOrder.type && price === incomingOrder.price
  })
}
function Deal(benefitMatch, existingBook) {
  if (benefitMatch.length > 0) {
    for (var i = 0; i < existingBook.length; i++) {
      if (existingBook[i].quantity === benefitMatch[0].quantity) {
        existingBook.splice(i, 1)
        i = existingBook.length
      }
    }
    return existingBook
  }
}



//pulls orders from existingBook that match in price and correspond in type
function reconcileOrder(existingBook, incomingOrder) {
  let matchingOrders = getMatchingOrders(existingBook, incomingOrder)
  let benefitMatch = getBenefitMatches(existingBook, incomingOrder)
  if (matchingOrders.length === 0 && benefitMatch.length === 0) {
    return existingBook.concat(incomingOrder)
  }

  if (benefitMatch.length > 0) {
    return Deal(benefitMatch, existingBook)
  }

  let quantityMatch = getQuantityMatching(matchingOrders, incomingOrder)
  if (quantityMatch.length > 0) {
    return handleQuantityMatch(quantityMatch, existingBook)
  }

  let quantityGreater = getQuantityGreaterThan(matchingOrders, incomingOrder)
  if (quantityGreater.length > 0) {
    return handleGreaterThan(quantityGreater, existingBook, incomingOrder)
  }

  let quantityLess = partialFulfillment(matchingOrders, incomingOrder)
  if (quantityLess.length > 0) {
    return handlePartialFulfillment(quantityLess, existingBook, incomingOrder)
  }
}


module.exports = reconcileOrder