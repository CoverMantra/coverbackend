module.exports = {
    TermLife: [
        "name",
        "dob",
        "age",
        "gender",
        "smokerStatus",     // smoker / non-smoker
        "policyTerm",       // years (e.g., 10, 20, 30)
        "sumAssured",       // coverage amount
        "annualIncome",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    WholeLife: [
        "name",
        "dob",
        "age",
        "gender",
        "smokerStatus",
        "premiumPaymentTerm", // single, limited, regular
        "sumAssured",
        "occupation",
        "annualIncome",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    Endowment: [
        "name",
        "dob",
        "age",
        "gender",
        "policyTerm",
        "premiumAmount",
        "sumAssured",
        "annualIncome",
        "occupation",
        "smokerStatus",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    MoneyBack: [
        "name",
        "dob",
        "age",
        "gender",
        "policyTerm",
        "premiumAmount",
        "sumAssured",
        "payoutFrequency", // e.g., every 5 years
        "annualIncome",
        "occupation",
        "smokerStatus",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    ULIP: [
        "name",
        "dob",
        "age",
        "gender",
        "policyTerm",
        "premiumPaymentTerm",
        "premiumAmount",
        "fundType", // equity / debt / hybrid
        "sumAssured",
        "annualIncome",
        "riskProfile",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    ChildPlan: [
        "parentName",
        "parentDob",
        "parentAge",
        "childName",
        "childDob",
        "policyTerm",
        "premiumAmount",
        "sumAssured",
        "annualIncome",
        "smokerStatus",
        "occupation",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    PensionPlan: [
        "name",
        "dob",
        "age",
        "gender",
        "policyTerm",
        "premiumPaymentTerm",
        "premiumAmount",
        "annuityType", // immediate / deferred
        "sumAssured",
        "annualIncome",
        "retirementAge",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ],

    GroupLife: [
        "organizationName",
        "employeeId",
        "employeeName",
        "employeeDob",
        "employeeAge",
        "employeeGender",
        "employeeIncome",
        "sumAssured",
        "nomineeName",
        "nomineeRelation",
        "contactNumber",
        "email",
        "address"
    ]
};
