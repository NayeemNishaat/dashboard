let countries = [
  { name: "Afghanistan", code: "AF" },
  { name: "Åland Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People's Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia and Montenegro", code: "CS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" }
];
let countrySettings = {
  AF: {
    languages: [{ name: "Uzbek", code: "uz" }],
    currencies: [{ code: "AFN", symbol: "؋" }]
  },
  AL: {
    languages: [
      { name: "Greek", code: "el" },
      { name: "Macedonian", code: "mk" }
    ],
    currencies: [{ code: "ALL", symbol: "Lek" }]
  },
  DZ: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "DZD", symbol: "دج" }]
  },
  AS: {
    languages: [
      { name: "English", code: "en" },
      { name: "Samoan", code: "sm" }
    ],
    currencies: [{ code: "USD", symbol: "$" }]
  },
  AD: {
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  AO: {
    languages: [{ name: "Kongo", code: "kg" }],
    currencies: [{ code: "AOA", symbol: "Kz" }]
  },
  AI: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "XCD", symbol: "$" }]
  },
  AR: {
    languages: [
      { name: "Italian", code: "it" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "ARS", symbol: "$" }]
  },
  AM: {
    languages: [
      { name: "Armenian", code: "hy" },
      { name: "Azerbaijani", code: "az" }
    ],
    currencies: [{ code: "AMD", symbol: "֏" }]
  },
  AW: {
    languages: [
      { name: "Dutch", code: "nl" },
      { name: "English", code: "en" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "AWG", symbol: "ƒ" }]
  },
  AU: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "English", code: "en" },
      { name: "German", code: "de" },
      { name: "Greek", code: "el" },
      { name: "Italian", code: "it" },
      { name: "Vietnamese", code: "vi" }
    ],
    currencies: [{ code: "AUD", symbol: "$" }]
  },
  AT: {
    languages: [{ name: "German", code: "de" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  AZ: {
    languages: [
      { name: "Armenian", code: "hy" },
      { name: "Azerbaijani", code: "az" },
      { name: "Russian", code: "ru" }
    ],
    currencies: [{ code: "AZN", symbol: "₼" }]
  },
  BS: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "BSD", symbol: "$" }]
  },
  BH: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "English", code: "en" }
    ],
    currencies: [{ code: "BHD", symbol: "BD" }]
  },
  BD: {
    languages: [{ name: "Bengali", code: "bn" }],
    currencies: [{ code: "BDT", symbol: "৳" }]
  },
  BB: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "BBD", symbol: "$" }]
  },
  BY: {
    languages: [
      { name: "Polish", code: "pl" },
      { name: "Russian", code: "ru" },
      { name: "Ukrainian", code: "uk" }
    ],
    currencies: [{ code: "BYN", symbol: "Br" }]
  },
  BE: {
    languages: [
      { name: "Dutch", code: "nl" },
      { name: "French", code: "fr" },
      { name: "German", code: "de" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  BZ: {
    languages: [
      { name: "English", code: "en" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "BZD", symbol: "BZ$" }]
  },
  BJ: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "CFA", symbol: "CFA" }]
  },
  BM: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "BMD", symbol: "$" }]
  },
  BT: {
    languages: [
      { name: "Dzongkha", code: "dz" },
      { name: "Nepali", code: "ne" }
    ],
    currencies: [{ code: "BOB", symbol: "$b" }]
  },
  BO: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "BOP", symbol: "b$" }]
  },
  BA: {
    languages: [{ name: "Bosnian", code: "bs" }],
    currencies: [{ code: "BAM", symbol: "KM" }]
  },
  BW: {
    languages: [
      { name: "Shona", code: "sn" },
      { name: "Tswana", code: "tn" }
    ],
    currencies: [{ code: "BWP", symbol: "P" }]
  },
  BV: {
    languages: [{ name: "Norwegian", code: "no" }],
    currencies: [{ code: "NOK", symbol: "kr" }]
  },
  BR: {
    languages: [
      { name: "German", code: "de" },
      { name: "Italian", code: "it" },
      { name: "Japanese", code: "ja" },
      { name: "Portuguese", code: "pt" }
    ],
    currencies: [{ code: "BRL", symbol: "R$" }]
  },
  BN: {
    languages: [
      { name: "English", code: "en" },
      { name: "Malay", code: "ms" }
    ],
    currencies: [{ code: "BND", symbol: "$" }]
  },
  BG: {
    languages: [
      { name: "Macedonian", code: "mk" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "BGN", symbol: "лв" }]
  },
  BF: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "CFA", symbol: "CFA" }]
  },
  BI: {
    languages: [
      { name: "French", code: "fr" },
      { name: "Swahili", code: "sw" }
    ],
    currencies: [{ code: "FBu", symbol: "FBu" }]
  },
  KH: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Vietnamese", code: "vi" }
    ],
    currencies: [{ code: "KHR", symbol: "៛" }]
  },
  CM: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "XAF", symbol: "FCFA" }]
  },
  CA: {
    languages: [
      { name: "English", code: "en" },
      { name: "French", code: "fr" }
    ],
    currencies: [{ code: "CAD", symbol: "$" }]
  },
  KY: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "KYD", symbol: "$" }]
  },
  CL: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "CLP", symbol: "$" }]
  },
  CN: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Mongolian", code: "mn" },
      { name: "Tibetan", code: "bo" },
      { name: "Uighur", code: "ug" }
    ],
    currencies: [{ code: "CNY", symbol: "¥" }]
  },
  CO: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "COP", symbol: "$" }]
  },
  CK: {
    languages: [
      { name: "English", code: "en" },
      { name: "Maori", code: "mi" }
    ],
    currencies: [{ code: "NZD", symbol: "$" }]
  },
  CR: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "CRC", symbol: "₡" }]
  },
  HR: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "HRK", symbol: "kn" }]
  },
  CU: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "CUP", symbol: "₱" }]
  },
  CY: {
    languages: [
      { name: "Greek", code: "el" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  CZ: {
    languages: [
      { name: "Czech", code: "cs" },
      { name: "German", code: "de" },
      { name: "Hungarian", code: "hu" },
      { name: "Polish", code: "pl" },
      { name: "Slovak", code: "sk" }
    ],
    currencies: [{ code: "CZK", symbol: "Kč" }]
  },
  DK: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Danish", code: "da" },
      { name: "English", code: "en" },
      { name: "German", code: "de" },
      { name: "Norwegian", code: "no" },
      { name: "Swedish", code: "sv" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "DKK", symbol: "kr" }]
  },
  DO: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "DOP", symbol: "RD$" }]
  },
  EC: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "USD", symbol: "$" }]
  },
  EG: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "EGP", symbol: "£" }]
  },
  SV: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "SVC", symbol: "$" }]
  },
  EE: {
    languages: [{ name: "Estonian", code: "et" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  FI: {
    languages: [{ name: "Finnish", code: "fi" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  FR: {
    languages: [{ name: "French", code: "fr" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  DE: {
    languages: [{ name: "German", code: "de" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  GH: {
    languages: [
      { name: "Akan", code: "ak" },
      { name: "Ewe", code: "ee" }
    ],
    currencies: [{ code: "FJD", symbol: "$" }]
  },
  GI: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "English", code: "en" }
    ],
    currencies: [{ code: "GHS", symbol: "¢" }]
  },
  GR: {
    languages: [{ name: "Greek", code: "el" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  GL: {
    languages: [{ name: "Danish", code: "da" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  GD: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "XCD", symbol: "4" }]
  },
  GT: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "GIP", symbol: "£" }]
  },
  GG: {
    currencies: [{ code: "GBP", symbol: "£" }]
  },
  GY: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "GYD", symbol: "$" }]
  },
  HN: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "HNL", symbol: "L" }]
  },
  HK: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "HKD", symbol: "$" }]
  },
  HU: {
    languages: [
      { name: "German", code: "de" },
      { name: "Hungarian", code: "hu" },
      { name: "Romanian", code: "ro" },
      { name: "Slovak", code: "sk" }
    ],
    currencies: [{ code: "HUF", symbol: "Ft" }]
  },
  IS: {
    languages: [
      { name: "English", code: "en" },
      { name: "Icelandic", code: "is" }
    ],
    currencies: [{ code: "ISK", symbol: "kr" }]
  },
  IN: {
    languages: [
      { name: "Bengali", code: "bn" },
      { name: "Gujarati", code: "gu" },
      { name: "Hindi", code: "hi" },
      { name: "Kannada", code: "kn" },
      { name: "Marathi", code: "mr" },
      { name: "Tamil", code: "ta" },
      { name: "Telugu", code: "te" },
      { name: "Urdu", code: "ur" }
    ],
    currencies: [{ code: "INR", symbol: "₨" }]
  },
  ID: {
    languages: [{ name: "Bahasa Indonesia", code: "ms" }],
    currencies: [{ code: "IDR", symbol: "Rp" }]
  },
  IE: {
    languages: [
      { name: "English", code: "en" },
      { name: "Irish", code: "ga" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  IL: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Hebrew", code: "he" }
    ],
    currencies: [{ code: "ILS", symbol: "₪" }]
  },
  IT: {
    languages: [{ name: "Italian", code: "it" }],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  JM: {
    languages: [{ name: "Hindi", code: "hi" }],
    currencies: [{ code: "JMD", symbol: "J$" }]
  },
  JP: {
    languages: [
      { name: "English", code: "en" },
      { name: "Japanese", code: "ja" }
    ],
    currencies: [{ code: "JPY", symbol: "¥" }]
  },
  JO: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "JOD", symbol: "د.ا" }]
  },
  KZ: {
    languages: [
      { name: "Kazakh", code: "kk" },
      { name: "Russian", code: "ru" }
    ],
    currencies: [{ code: "KZT", symbol: "лв" }]
  },
  KR: {
    languages: [{ name: "Korean", code: "ko" }],
    currencies: [{ code: "KRW", symbol: "₩" }]
  },
  KG: {
    languages: [
      { name: "Kazakh", code: "kk" },
      { name: "Russian", code: "ru" },
      { name: "Tatar", code: "tt" },
      { name: "Ukrainian", code: "uk" },
      { name: "Uzbek", code: "uz" }
    ],
    currencies: [{ code: "KGS", symbol: "лв" }]
  },
  LB: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Armenian", code: "hy" },
      { name: "French", code: "fr" }
    ],
    currencies: [{ code: "LBP", symbol: "£" }]
  },
  LS: {
    languages: [
      { name: "English", code: "en" },
      { name: "Zulu", code: "zu" }
    ],
    currencies: [{ code: "ZAR", symbol: "R" }]
  },
  LR: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "LRD", symbol: "$" }]
  },
  LI: {
    languages: [
      { name: "German", code: "de" },
      { name: "Italian", code: "it" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "CHF", symbol: "CHF" }]
  },
  LU: {
    languages: [
      { name: "French", code: "fr" },
      { name: "German", code: "de" },
      { name: "Italian", code: "it" },
      { name: "Luxembourgish", code: "lb" },
      { name: "Portuguese", code: "pt" }
    ],
    currencies: []
  },
  MO: {
    languages: [
      { name: "English", code: "en" },
      { name: "Portuguese", code: "pt" }
    ],
    currencies: []
  },
  MG: {
    languages: [
      { name: "French", code: "fr" },
      { name: "Malagasy", code: "mg" }
    ],
    currencies: []
  },
  MW: {
    languages: [{ name: "Chichewa", code: "ny" }],
    currencies: []
  },
  MY: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "English", code: "en" },
      { name: "Malay", code: "ms" },
      { name: "Tamil", code: "ta" }
    ],
    currencies: [{ code: "MYR", symbol: "RM" }]
  },
  MV: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  ML: {
    languages: [{ name: "Bambara", code: "bm" }],
    currencies: []
  },
  MT: {
    languages: [
      { name: "English", code: "en" },
      { name: "Maltese", code: "mt" }
    ],
    currencies: []
  },
  MH: {
    languages: [
      { name: "English", code: "en" },
      { name: "Marshallese", code: "mh" }
    ],
    currencies: []
  },
  MQ: {
    languages: [{ name: "French", code: "fr" }],
    currencies: []
  },
  MR: {
    languages: [{ name: "Wolof", code: "wo" }],
    currencies: []
  },
  MU: {
    languages: [
      { name: "French", code: "fr" },
      { name: "Hindi", code: "hi" },
      { name: "Marathi", code: "mr" },
      { name: "Tamil", code: "ta" }
    ],
    currencies: [{ code: "MUR", symbol: "₨" }]
  },
  YT: {
    languages: [
      { name: "French", code: "fr" },
      { name: "Malagasy", code: "mg" }
    ],
    currencies: []
  },
  MX: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "MXN", symbol: "$" }]
  },
  FM: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  MC: {
    languages: [
      { name: "English", code: "en" },
      { name: "French", code: "fr" },
      { name: "Italian", code: "it" }
    ],
    currencies: []
  },
  MN: {
    languages: [
      { name: "Kazakh", code: "kk" },
      { name: "Mongolian", code: "mn" }
    ],
    currencies: [{ code: "MNT", symbol: "₮" }]
  },
  MS: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  MA: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: []
  },
  MZ: {
    languages: [
      { name: "Shona", code: "sn" },
      { name: "Tsonga", code: "ts" }
    ],
    currencies: [{ code: "MZN", symbol: "MT" }]
  },
  MM: {
    languages: [{ name: "Burmese", code: "my" }],
    currencies: []
  },
  NA: {
    languages: [
      { name: "Afrikaans", code: "af" },
      { name: "German", code: "de" },
      { name: "Herero", code: "hz" }
    ],
    currencies: [{ code: "NAD", symbol: "$" }]
  },
  NR: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "English", code: "en" },
      { name: "Nauru", code: "na" }
    ],
    currencies: []
  },
  NP: {
    languages: [
      { name: "Hindi", code: "hi" },
      { name: "Nepali", code: "ne" }
    ],
    currencies: [{ code: "NPR", symbol: "₨" }]
  },
  NL: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Dutch", code: "nl" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  AN: {
    languages: [
      { name: "Dutch", code: "nl" },
      { name: "English", code: "en" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  NC: {
    languages: [{ name: "French", code: "fr" }],
    currencies: []
  },
  NZ: {
    languages: [
      { name: "English", code: "en" },
      { name: "Maori", code: "mi" }
    ],
    currencies: []
  },
  NI: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "NIO", symbol: "C$" }]
  },
  NE: {
    languages: [
      { name: "Hausa", code: "ha" },
      { name: "Kanuri", code: "kr" }
    ],
    currencies: []
  },
  NG: {
    languages: [
      { name: "Hausa", code: "ha" },
      { name: "Kanuri", code: "kr" }
    ],
    currencies: [{ code: "NGN", symbol: "₦" }]
  },
  NU: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  NF: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  MP: {
    languages: [
      { name: "Chamorro", code: "ch" },
      { name: "Chinese", code: "zh" },
      { name: "English", code: "en" },
      { name: "Korean", code: "ko" }
    ],
    currencies: []
  },
  NO: {
    languages: [
      { name: "Danish", code: "da" },
      { name: "English", code: "en" },
      { name: "Norwegian", code: "no" },
      { name: "Swedish", code: "sv" }
    ],
    currencies: [{ code: "NOK", symbol: "kr" }]
  },
  OM: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "OMR", symbol: "﷼" }]
  },
  PK: {
    languages: [
      { name: "Sindhi", code: "sd" },
      { name: "Urdu", code: "ur" }
    ],
    currencies: [{ code: "PKR", symbol: "₨" }]
  },
  PW: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "English", code: "en" }
    ],
    currencies: []
  },
  PA: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "PAB", symbol: "B/." }]
  },
  PG: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  PY: {
    languages: [
      { name: "German", code: "de" },
      { name: "Portuguese", code: "pt" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "PYG", symbol: "Gs" }]
  },
  PE: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "PEN", symbol: "S/." }]
  },
  PH: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "PHP", symbol: "₱" }]
  },
  PN: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  PL: {
    languages: [
      { name: "German", code: "de" },
      { name: "Polish", code: "pl" },
      { name: "Ukrainian", code: "uk" }
    ],
    currencies: [
      { code: "PLN", symbol: "zł" },
      { code: "EUR", symbol: "€" }
    ]
  },
  PT: {
    languages: [{ name: "Portuguese", code: "pt" }],
    currencies: []
  },
  PR: {
    languages: [
      { name: "English", code: "en" },
      { name: "Spanish", code: "es" }
    ],
    currencies: []
  },
  QA: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Urdu", code: "ur" }
    ],
    currencies: [{ code: "QAR", symbol: "﷼" }]
  },
  RE: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Malagasy", code: "mg" },
      { name: "Tamil", code: "ta" }
    ],
    currencies: []
  },
  RO: {
    languages: [
      { name: "German", code: "de" },
      { name: "Hungarian", code: "hu" },
      { name: "Romanian", code: "ro" },
      { name: "Ukrainian", code: "uk" }
    ],
    currencies: [{ code: "RON", symbol: "lei" }]
  },
  RU: {
    languages: [
      { name: "Bashkir", code: "ba" },
      { name: "Chechen", code: "ce" },
      { name: "Chuvash", code: "cv" },
      { name: "Kazakh", code: "kk" },
      { name: "Russian", code: "ru" },
      { name: "Tatar", code: "tt" },
      { name: "Ukrainian", code: "uk" }
    ],
    currencies: [{ code: "RUB", symbol: "₽" }]
  },
  SH: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  KN: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  LC: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  PM: {
    languages: [{ name: "French", code: "fr" }],
    currencies: []
  },
  VC: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  WS: {
    languages: [
      { name: "English", code: "en" },
      { name: "Samoan", code: "sm" }
    ],
    currencies: []
  },
  SM: {
    languages: [{ name: "Italian", code: "it" }],
    currencies: []
  },
  ST: {
    languages: [{ name: "French", code: "fr" }],
    currencies: []
  },
  SA: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "SAR", symbol: "﷼" }]
  },
  SN: {
    languages: [{ name: "Wolof", code: "wo" }],
    currencies: []
  },
  CS: {
    currencies: []
  },
  SC: {
    languages: [
      { name: "English", code: "en" },
      { name: "French", code: "fr" }
    ],
    currencies: [{ code: "SCR", symbol: "₨" }]
  },
  SL: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  SG: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Malay", code: "ms" },
      { name: "Tamil", code: "ta" }
    ],
    currencies: [{ code: "SGD", symbol: "$" }]
  },
  SK: {
    languages: [
      { name: "Hungarian", code: "hu" },
      { name: "Slovak", code: "sk" }
    ],
    currencies: []
  },
  SI: {
    languages: [{ name: "Hungarian", code: "hu" }],
    currencies: []
  },
  SB: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "SBD", symbol: "$" }]
  },
  SO: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Somali", code: "so" }
    ],
    currencies: [{ code: "SOS", symbol: "S" }]
  },
  ZA: {
    languages: [
      { name: "Afrikaans", code: "af" },
      { name: "English", code: "en" },
      { name: "Tsonga", code: "ts" },
      { name: "Tswana", code: "tn" },
      { name: "Venda", code: "ve" },
      { name: "Xhosa", code: "xh" },
      { name: "Zulu", code: "zu" }
    ],
    currencies: []
  },
  ES: {
    languages: [
      { name: "Basque", code: "eu" },
      { name: "Catalan", code: "ca" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "EUR", symbol: "€" }]
  },
  LK: {
    languages: [
      { name: "English", code: "en" },
      { name: "Sinhala", code: "si" },
      { name: "Tamil", code: "ta" }
    ],
    currencies: [{ code: "LKR", symbol: "₨" }]
  },
  SD: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: []
  },
  SR: {
    languages: [{ name: "Hindi", code: "hi" }],
    currencies: [{ code: "SRD", symbol: "$" }]
  },
  SJ: {
    languages: [
      { name: "Norwegian", code: "no" },
      { name: "Russian", code: "ru" }
    ],
    currencies: []
  },
  SZ: {
    languages: [{ name: "Zulu", code: "zu" }],
    currencies: []
  },
  SE: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Finnish", code: "fi" },
      { name: "Norwegian", code: "no" },
      { name: "Spanish", code: "es" },
      { name: "Swedish", code: "sv" }
    ],
    currencies: [{ code: "SEK", symbol: "kr" }]
  },
  CH: {
    languages: [
      { name: "French", code: "fr" },
      { name: "German", code: "de" },
      { name: "Italian", code: "it" },
      { name: "Romansh", code: "rm" }
    ],
    currencies: []
  },
  SY: {
    currencies: [{ code: "SYP", symbol: "£" }]
  },
  TW: {
    currencies: [{ code: "TWD", symbol: "NT$" }]
  },
  TJ: {
    languages: [
      { name: "Russian", code: "ru" },
      { name: "Uzbek", code: "uz" }
    ],
    currencies: []
  },
  TZ: {
    currencies: []
  },
  TH: {
    languages: [
      { name: "Chinese", code: "zh" },
      { name: "Lao", code: "lo" },
      { name: "Malay", code: "ms" },
      { name: "Thai", code: "th" }
    ],
    currencies: [{ code: "THB", symbol: "฿" }]
  },
  TG: {
    languages: [{ name: "Ewe", code: "ee" }],
    currencies: []
  },
  TK: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  TO: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  TT: {
    languages: [
      { name: "English", code: "en" },
      { name: "Hindi", code: "hi" }
    ],
    currencies: [{ code: "TTD", symbol: "TT$" }]
  },
  TN: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: []
  },
  TR: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Kurdish", code: "ku" },
      { name: "Turkish", code: "tr" }
    ],
    currencies: [{ code: "TRY", symbol: "₺" }]
  },
  TM: {
    languages: [
      { name: "Kazakh", code: "kk" },
      { name: "Russian", code: "ru" },
      { name: "Uzbek", code: "uz" }
    ],
    currencies: []
  },
  TC: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  TV: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  UG: {
    languages: [{ name: "Ganda", code: "lg" }],
    currencies: []
  },
  UA: {
    languages: [
      { name: "Hungarian", code: "hu" },
      { name: "Polish", code: "pl" },
      { name: "Romanian", code: "ro" },
      { name: "Russian", code: "ru" },
      { name: "Ukrainian", code: "uk" }
    ],
    currencies: [{ code: "UAH", symbol: "₴" }]
  },
  AE: {
    languages: [
      { name: "Arabic", code: "ar" },
      { name: "Hindi", code: "hi" }
    ],
    currencies: []
  },
  GB: {
    languages: [{ name: "English", code: "en" }],
    currencies: [{ code: "GBP", symbol: "£" }]
  },
  US: {
    languages: [
      { name: "English", code: "en" },
      { name: "Spanish", code: "es" }
    ],
    currencies: [{ code: "USD", symbol: "$" }]
  },
  UM: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  UY: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: [{ code: "UYU", symbol: "$U" }]
  },
  UZ: {
    languages: [
      { name: "Kazakh", code: "kk" },
      { name: "Russian", code: "ru" },
      { name: "Tatar", code: "tt" },
      { name: "Uzbek", code: "uz" }
    ],
    currencies: [{ code: "UZS", symbol: "лв" }]
  },
  VU: {
    languages: [
      { name: "Bislama", code: "bi" },
      { name: "English", code: "en" },
      { name: "French", code: "fr" }
    ],
    currencies: [{ code: "VEF", symbol: "Bs" }]
  },
  VE: {
    languages: [{ name: "Spanish", code: "es" }],
    currencies: []
  },
  VN: {
    currencies: [{ code: "VND", symbol: "₫" }]
  },
  VG: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  VI: {
    languages: [
      { name: "English", code: "en" },
      { name: "French", code: "fr" },
      { name: "Spanish", code: "es" }
    ],
    currencies: []
  },
  WF: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  EH: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: []
  },
  YE: {
    languages: [{ name: "Arabic", code: "ar" }],
    currencies: [{ code: "YER", symbol: "﷼" }]
  },
  ZM: {
    languages: [{ name: "English", code: "en" }],
    currencies: []
  },
  ZW: {
    languages: [
      { name: "English", code: "en" },
      { name: "Shona", code: "sn" }
    ],
    currencies: [{ code: "ZWD", symbol: "Z$" }]
  }
};
const regionalSettings = {
  countries,
  countrySettings
};

export default regionalSettings;
