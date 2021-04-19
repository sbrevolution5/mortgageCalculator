class row {
    constructor(month, payment, principal, interest, totalInterest, balance) {
        this.month = month,
        this.payment = payment,
        this.principal = principal,
        this.interest = interest,
        this.totalInterest = totalInterest,
        this.balance = balance
    }
}
function loadpage() {
    let storedInput = localStorage.getItem("inputArray")
    console.log("running pageload   ")
    if(storedInput == ""){
        return
    }
    let input = JSON.parse(storedInput);
    document.getElementById("balance").value = input[0]
    document.getElementById("term").value = input[1] / 12
    document.getElementById("rate").value = (input[2]*100).toFixed(2)
}

function buildPaymentSchedule() {
    let balance = parseInt(document.getElementById("balance").value)
    let term = parseInt(document.getElementById("term").value) * 12
    let rate = parseFloat(document.getElementById("rate").value)/100
    let inputArray = [balance,term,rate]
    localStorage.setItem("inputArray", JSON.stringify(inputArray))
    let paymentArray = getPayments(balance, term, rate);
    displayData(paymentArray, balance);
}

function getPayments(balance, term, rate) {
    let res = []
    let totalInterest = 0;
    let prevBalance = balance
    let payment = calcPayment(balance, term, rate)
    let remainingBalance= balance
    for (let i = 1; i <= term; i++) {
        let interest = calcInterest(prevBalance, rate)
        let principal = calcPrincipal(payment, interest)
        totalInterest += interest
        remainingBalance -= principal;
        prevBalance = remainingBalance
        res.push(new row(i, payment, principal, interest, totalInterest, remainingBalance))
    }
    return res
}
// Total Monthly Payment = (amount loaned) * (rate / 1200) / (1–(1 + rate / 1200)(-Number of Months)) 
function calcPayment(amount, term, rate) {
    let payment = amount * (rate / 12) / (1 - (1 + rate / 12)**(0-term))
    return payment
}
// Interest Payment = Previous Remaining Balance * rate / 1200 
function calcInterest(prevBalance, rate) {
    return (prevBalance * rate / 12)
}
// Principal Payment = Total Monthly Payment - Interest PaymentAt end each month, 
function calcPrincipal(payment, interest) {
    return payment - interest;
}

function displayData(payments, totalPrincipal) {
    const template = document.getElementById("dataTemplate");
    const resultsBody = document.getElementById("resultsBody");
    //clear table
    resultsBody.innerHTML = "";

    for (let i = 0; i < payments.length; i++) {
        const dataRow = document.importNode(template.content, true);

        dataRow.getElementById("tempMonth").textContent = payments[i].month;
        dataRow.getElementById("tempPayment").textContent = `$${payments[i].payment.toFixed(2)}`;
        dataRow.getElementById("tempPrincipal").textContent = `$${payments[i].principal.toFixed(2)}`;
        dataRow.getElementById("tempInterest").textContent = `$${payments[i].interest.toFixed(2)}`;
        dataRow.getElementById("tempTotalInterest").textContent = `$${payments[i].totalInterest.toFixed(2)}`;
        dataRow.getElementById("tempBalance").textContent = `$${payments[i].balance.toFixed(2)}`;

        resultsBody.appendChild(dataRow);
    }
    document.getElementById("monthlyPayment").innerText = `$${payments[0].payment.toFixed(2)}`
    document.getElementById("totalPrincipal").innerText = `$${totalPrincipal.toFixed(2)/*.toLocaleString("en-US", {style: "currency", currency: "USD"})*/}`
    let totalInterest = parseFloat(payments[(payments.length - 1)].totalInterest);
    document.getElementById("totalInterest").innerText = `$${totalInterest.toFixed(2).toLocaleString()}`
    let totalCost =  (totalPrincipal + totalInterest)
    totalCost = totalCost.toFixed(2)
    document.getElementById("totalCost").innerText = `$${totalCost.toLocaleString()}`
}
loadpage()