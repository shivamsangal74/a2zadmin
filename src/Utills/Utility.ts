const validateAadhar = (aadharNumber: string) => {
  if (!/^\d{12}$/.test(aadharNumber)) {
    return false;
  } else {
    return true;
  }

  //   let sum = 0;
  //   for (let i = 0; i < 11; i++) {
  //     sum += parseInt(aadharNumber.charAt(i)) * (12 - i);
  //   }
  //   const remainder = sum % 11;
  //   const checksumDigit = remainder === 0 ? 0 : 11 - remainder;

  //   return parseInt(aadharNumber.charAt(11)) === checksumDigit;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (date: any) => {};

function generateAddress(data: any) {
  const address = data.data.address;
  const addressArray = [
    address?.house,
    address?.street,
    address?.subdist,
    address?.vtc,
    address?.po,
    address?.dist,
    address?.state,
    address?.country,
  ];

  const formattedAddress = addressArray.filter((field) => field).join(", ");

  return formattedAddress;
}

export { validateAadhar, capitalize, formatDate, generateAddress };
