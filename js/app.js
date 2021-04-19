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
    let paymentObj = getPayments(balance, term, rate);

    displayData(paymentObj, balance, totalInterest);
}

function getPayments(balance, term, rate) {
    let res = {
        payArr: [],
        summary:{}
    }
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
        res.payArr.push(new row(i, payment, principal, interest, totalInterest, remainingBalance))
    }
    res.summary.totalCost = (balance + totalInterest)
    res.summary.totalInterest = totalInterest
    res.summary.monthlyPayment = payment
    res.summary.totalPrincipal = balance
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
function moneyFormat(str) {
    return str.toLocaleString("en-us", {
        style: 'currency',
        currency: 'USD',
        signDisplay: "never"
    })
}

function displayData(payObj, totalPrincipal) {
    const template = document.getElementById("dataTemplate");
    const resultsBody = document.getElementById("resultsBody");
    //clear table
    resultsBody.innerHTML = "";

    for (let i = 0; i < payObj.payArr.length; i++) {
        const dataRow = document.importNode(template.content, true);

        dataRow.getElementById("tempMonth").textContent = payObj.payArr[i].month;
        dataRow.getElementById("tempPayment").textContent = `${moneyFormat(payObj.payArr[i].payment)}`;
        dataRow.getElementById("tempPrincipal").textContent = `${moneyFormat(payObj.payArr[i].principal)}`;
        dataRow.getElementById("tempInterest").textContent = `${moneyFormat(payObj.payArr[i].interest)}`;
        dataRow.getElementById("tempTotalInterest").textContent = `${moneyFormat(payObj.payArr[i].totalInterest)}`;
        dataRow.getElementById("tempBalance").textContent = `${moneyFormat(payObj.payArr[i].balance)}`;

        resultsBody.appendChild(dataRow);
    }
    document.getElementById("monthlyPayment").innerText = `${moneyFormat(payObj.summary.monthlyPayment)}`
    document.getElementById("totalPrincipal").innerText = `${moneyFormat(payObj.summary.totalPrincipal)}`
    document.getElementById("totalInterest").innerText = `${moneyFormat(payObj.summary.totalInterest)}`
    
    document.getElementById("totalCost").innerText = `${moneyFormat(payObj.summary.totalCost)}`
}
loadpage()