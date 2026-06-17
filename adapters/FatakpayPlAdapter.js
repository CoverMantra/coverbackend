const BaseAdapter = require("./BaseAdapter");
const axios = require("axios");

class FatakpayPlAdapter extends BaseAdapter {
  getFormConfig() {
    return {
      title: "FatakPay Personal Loans",
      logo: "https://www.fdplfinance.com/assets/images/logo/FatakLoans.svg",
      fields: [
        { name: "phone", label: "Mobile Number", type: "tel", placeholder: "Enter phone", required: true, pattern: "^[6-9]\\d{9}$" },
        { name: "first_name", label: "First Name", type: "text", placeholder: "First Name", required: true },
        { name: "last_name", label: "Last Name", type: "text", placeholder: "Last Name", required: true },
        { name: "dob", label: "Date of Birth", type: "date", required: true },
        { name: "email", label: "Email Address", type: "email", placeholder: "email@example.com", required: true },
        { name: "pan", label: "PAN Card", type: "text", placeholder: "ABCDE1234F", required: true, pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", uppercase: true },
        { name: "pincode", label: "Pincode", type: "text", placeholder: "Pincode", required: true },
        {
          name: "employmentType",
          label: "Employment Type",
          type: "select",
          required: true,
          options: [
            { label: "Salaried", value: "Salaried" },
            { label: "Self-Employed", value: "Self-Employed" }
          ]
        }
      ],
      consentText: "I authorize CoverMantra to share my details with FatakPay for loan eligibility check.",
      redirectUrlOnSuccess: "https://web.fatakpay.com/authentication/login?utm_source=651_TT83W&utm_medium=covermantra"
    };
  }

  async get_token() {
    const domain = process.env.FATAKPAY_DOMAIN;
    const data = {
      username: process.env.FATAKPAY_USERNAME,
      password: process.env.FATAKPAY_PASSWORD,
    };
    const apires = await axios.post(`${domain}/create-user-token`, data);
    return apires.data?.data?.token;
  }

  async register(lead) {
    const domain = process.env.FATAKPAY_DOMAIN;
    const token = await this.get_token();
    if (!token) throw new Error("FatakPay PL Authentication Failed");

    const userData = {
      mobile: String(lead.phone),
      first_name: lead.first_name,
      last_name: lead.last_name,
      pan: lead.pan?.toUpperCase(),
      dob: lead.dob,
      email: lead.email,
      employment_type_id: lead.employmentType,
      pincode: String(lead.pincode),
      partnerId: "Covermantra",
      consent: true,
      consent_timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    const apiFatakpay = await axios.post(
      `${domain}/emi-insurance-eligibility`,
      userData,
      { headers: { Authorization: `Token ${token}` } }
    );

    const apiData = apiFatakpay.data?.data;
    const isSuccess = apiData?.success && apiData?.message === "You are eligible.";

    return {
      success: isSuccess,
      redirectUrl: isSuccess ? this.getFormConfig().redirectUrlOnSuccess : null,
      offer: isSuccess ? "Eligible" : null,
      apiResponse: apiFatakpay.data
    };
  }
}

module.exports = FatakpayPlAdapter;
