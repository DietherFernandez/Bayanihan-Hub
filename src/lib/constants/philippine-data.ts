import type {
  AnnouncementRecord,
  AssistanceProgramRecord,
  AuditLogItem,
  BayanihanPostRecord,
  EmergencyHotlineRecord,
  EvacuationCenterRecord,
  LocationRecord,
  OpportunityRecord,
  OrganizationRecord,
  ReportSubmission,
  ResourceRecord,
  UniversalSearchResult,
} from "@/types/database";

export const PH_LOCATIONS: LocationRecord[] = [
  {
    id: "loc-nat",
    psgcCode: "PH-NAT",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    isNational: true,
  },
  {
    id: "loc-ncr",
    psgcCode: "130000000",
    regionCode: "NCR",
    regionName: "National Capital Region (Metro Manila)",
    province: "Metro Manila",
    cityMunicipality: "Quezon City / Manila",
    isNational: false,
  },
  {
    id: "loc-4a",
    psgcCode: "040000000",
    regionCode: "Region IV-A",
    regionName: "CALABARZON",
    province: "Cavite, Laguna, Batangas, Rizal, Quezon",
    isNational: false,
  },
  {
    id: "loc-3",
    psgcCode: "030000000",
    regionCode: "Region III",
    regionName: "Central Luzon",
    province: "Bulacan, Pampanga, Tarlac, Nueva Ecija",
    isNational: false,
  },
  {
    id: "loc-7",
    psgcCode: "070000000",
    regionCode: "Region VII",
    regionName: "Central Visayas",
    province: "Cebu, Bohol, Negros Oriental",
    cityMunicipality: "Cebu City",
    isNational: false,
  },
  {
    id: "loc-11",
    psgcCode: "110000000",
    regionCode: "Region XI",
    regionName: "Davao Region",
    province: "Davao del Sur",
    cityMunicipality: "Davao City",
    isNational: false,
  },
  {
    id: "loc-5",
    psgcCode: "050000000",
    regionCode: "Region V",
    regionName: "Bicol Region",
    province: "Albay, Camarines Sur",
    cityMunicipality: "Legazpi / Naga",
    isNational: false,
  },
];

export const VERIFIED_ORGANIZATIONS: OrganizationRecord[] = [
  {
    id: "org-psa",
    name: "Philippine Statistics Authority",
    acronym: "PSA",
    slug: "psa",
    orgType: "gov_agency",
    description:
      "Central statistical authority of the Philippine government responsible for civil registration (Birth, Marriage, CENOMAR) and the PhilSys National ID.",
    officialWebsite: "https://psa.gov.ph",
    verifiedEmailDomain: "psa.gov.ph",
    hotline: "(02) 8462-6600 / 1388 (PhilSys)",
    address: "PSA Complex, East Avenue, Diliman, Quezon City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-nbi",
    name: "National Bureau of Investigation",
    acronym: "NBI",
    slug: "nbi",
    orgType: "gov_agency",
    description:
      "Agency under the Department of Justice issuing multi-purpose NBI Clearances and investigating cybercrime and recruitment fraud.",
    officialWebsite: "https://clearance.nbi.gov.ph",
    verifiedEmailDomain: "nbi.gov.ph",
    hotline: "(02) 8523-8231 to 38",
    address: "NBI Building, Taft Avenue, Ermita, Manila",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-philhealth",
    name: "Philippine Health Insurance Corporation",
    acronym: "PhilHealth",
    slug: "philhealth",
    orgType: "gov_agency",
    description:
      "Administers the National Health Insurance Program providing inpatient, outpatient, Konsulta, and Z-Benefit packages for Filipinos.",
    officialWebsite: "https://www.philhealth.gov.ph",
    verifiedEmailDomain: "philhealth.gov.ph",
    hotline: "(02) 8662-2588",
    address: "Citystate Centre, 709 Shaw Boulevard, Pasig City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-sss",
    name: "Social Security System",
    acronym: "SSS",
    slug: "sss",
    orgType: "gov_agency",
    description:
      "Social insurance program for workers in the private, professional, OFW, and informal sectors offering sickness, maternity, disability, retirement, and calamity loans.",
    officialWebsite: "https://www.sss.gov.ph",
    verifiedEmailDomain: "sss.gov.ph",
    hotline: "1455 / (02) 81455",
    address: "SSS Building, East Avenue, Diliman, Quezon City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-pagibig",
    name: "Home Development Mutual Fund",
    acronym: "Pag-IBIG",
    slug: "pag-ibig",
    orgType: "gov_agency",
    description:
      "National savings program (Regular & MP2 Savings), Multi-Purpose Loans, Calamity Loans, and affordable housing loans for Filipino workers.",
    officialWebsite: "https://www.pagibigfund.gov.ph",
    verifiedEmailDomain: "pagibigfund.gov.ph",
    hotline: "(02) 8724-4244",
    address: "Petron MegaPlaza, 358 Sen. Gil Puyat Ave., Makati City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-dswd",
    name: "Department of Social Welfare and Development",
    acronym: "DSWD",
    slug: "dswd",
    orgType: "gov_agency",
    description:
      "Lead agency for social protection, administering Assistance to Individuals in Crisis Situations (AICS), 4Ps, Sustainable Livelihood, and disaster relief.",
    officialWebsite: "https://www.dswd.gov.ph",
    verifiedEmailDomain: "dswd.gov.ph",
    hotline: "(02) 8931-8101 to 07",
    address: "IBP Road, Batasan Pambansa Complex, Quezon City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-dole",
    name: "Department of Labor and Employment",
    acronym: "DOLE",
    slug: "dole",
    orgType: "gov_agency",
    description:
      "Coordinates employment facilitation via PhilJobNet, PESO offices, TUPAD emergency employment, and worker rights protection.",
    officialWebsite: "https://www.dole.gov.ph",
    verifiedEmailDomain: "dole.gov.ph",
    hotline: "1349",
    address: "DOLE Building, Muralla Wing cor. Gen. Luna St., Intramuros, Manila",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-tesda",
    name: "Technical Education and Skills Development Authority",
    acronym: "TESDA",
    slug: "tesda",
    orgType: "gov_agency",
    description:
      "Provides free technical-vocational training, TESDA Online Program (TOP) courses, and National Certificate (NC) assessments.",
    officialWebsite: "https://www.tesda.gov.ph",
    verifiedEmailDomain: "tesda.gov.ph",
    hotline: "(02) 8887-7777",
    address: "East Service Road, South Luzon Expressway, Taguig City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-ched",
    name: "Commission on Higher Education",
    acronym: "CHED",
    slug: "ched",
    orgType: "gov_agency",
    description:
      "Oversees tertiary education institutions, CHED Merit Scholarships (CMSP), and UniFAST Republic Act 10931 Free Higher Education.",
    officialWebsite: "https://ched.gov.ph",
    verifiedEmailDomain: "ched.gov.ph",
    hotline: "(02) 8441-1260",
    address: "Higher Education Development Center Building, C.P. Garcia Ave, UP Campus, Quezon City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "org-redcross",
    name: "Philippine Red Cross",
    acronym: "PRC",
    slug: "red-cross-ph",
    orgType: "ngo",
    description:
      "Humanitarian organization providing 24/7 ambulance response (143), blood bank coordination, disaster relief, and volunteer training.",
    officialWebsite: "https://redcross.org.ph",
    verifiedEmailDomain: "redcross.org.ph",
    hotline: "143 / (02) 8790-2300",
    address: "37 EDSA corner Boni Avenue, Mandaluyong City",
    verificationStatus: "officially_verified",
    status: "published",
    regionCode: "NATIONAL",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_RESOURCES: ResourceRecord[] = [
  {
    id: "res-psa-birth-cert",
    module: "serbisyo",
    categorySlug: "civil-registry-ids",
    categoryName: "Civil Registry & National IDs",
    organizationSlug: "psa",
    organizationName: "Philippine Statistics Authority",
    organizationAcronym: "PSA",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "psa-birth-certificate-request",
    title: "PSA Birth Certificate (Walk-In CRS Appointment & PSAHelpline / PSASerbilis)",
    summary:
      "Official guide for requesting an authenticated PSA Birth Certificate for employment, passport application, scholarship, or school enrollment.",
    requirementsChecklist: [
      {
        id: "chk-psa-1",
        label: "Confirmed CRS Online Appointment Slip (for walk-in at PSA Civil Registry System outlets)",
        notes: "Book via crs-appointment.psahelpline.ph for free before visiting a PSA outlet.",
        isMandatory: true,
      },
      {
        id: "chk-psa-2",
        label: "At least one (1) valid government-issued primary ID of the document owner or requester",
        notes: "PhilSys National ID (Card, ePhilID, or Digital National ID), Passport, Driver's License, UMID, or Postal ID.",
        isMandatory: true,
      },
      {
        id: "chk-psa-3",
        label: "Accomplished Application Form (AF) for Birth Certificate (available free at PSA outlets)",
        notes: "Include complete full name at birth, date and place of birth, and parents' full names.",
        isMandatory: true,
      },
      {
        id: "chk-psa-4",
        label: "Signed Authorization Letter + Valid ID of both owner and representative (ONLY if requested by an authorized representative)",
        notes: "First-time jobseekers under RA 11261 must also bring their original Barangay First-Time Jobseeker Certificate.",
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Book a Free CRS Outlet Appointment or Choose Online Delivery",
        description:
          "For walk-in claiming, schedule a slot via the official PSA CRS Appointment portal. For door-to-door delivery, apply via PSASerbilis or PSAHelpline.",
        officialPortalLink: "https://psa.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Present Valid ID and Accomplished Form at the PSA CRS Outlet",
        description:
          "Arrive 15–30 minutes before your scheduled slot. Present your valid ID and QR appointment code for verification.",
      },
      {
        stepNumber: 3,
        title: "Pay Official Processing Fee or Present RA 11261 Exemption",
        description:
          "Pay the statutory fee at the cashier (or present your Barangay First-Time Jobseeker Certification for free issuance under RA 11261).",
      },
      {
        stepNumber: 4,
        title: "Claim and Verify Printed SECPA Copy",
        description:
          "Check all spelling and entries on the printed PSA certificate before leaving the releasing window.",
      },
    ],
    eligibilitySummary:
      "The document owner (18 years old and above), spouse, parent, direct descendant, legal guardian, or duly authorized representative.",
    processingTime: "Walk-in CRS Outlet: Same day (1–2 hours) | Online Delivery: 3–8 working days depending on location",
    feesSummary:
      "Walk-in CRS Outlet: PHP 155.00 per copy | Free (PHP 0.00) for qualified First-Time Jobseekers under RA 11261 (1 copy).",
    sourceName: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/civilregistration/requesting-civil-registry-document/birth-certificate",
    contactInfo: {
      hotline: "(02) 8462-6600",
      email: "info@psa.gov.ph",
      hours: "Monday to Friday, 8:00 AM – 5:00 PM",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-nbi-clearance",
    module: "serbisyo",
    categorySlug: "civil-registry-ids",
    categoryName: "Civil Registry & National IDs",
    organizationSlug: "nbi",
    organizationName: "National Bureau of Investigation",
    organizationAcronym: "NBI",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "nbi-clearance-online-application",
    title: "NBI Multi-Purpose Clearance Application & First-Time Jobseeker Guide",
    summary:
      "Step-by-step instructions to register online, schedule biometrics, and claim your NBI Multi-Purpose Clearance, including free issuance under RA 11261.",
    requirementsChecklist: [
      {
        id: "chk-nbi-1",
        label: "Online NBI Clearance Account & Reference Number",
        notes: "Register at clearance.nbi.gov.ph and set an appointment branch and date.",
        isMandatory: true,
      },
      {
        id: "chk-nbi-2",
        label: "Two (2) Valid Original Government-Issued IDs",
        notes: "PhilSys National ID, Passport, PRC ID, Driver's License, UMID, Voter's ID/Certification, or PSA Birth Certificate.",
        isMandatory: true,
      },
      {
        id: "chk-nbi-3",
        label: "Original Barangay Certification & Oath of Undertaking (For RA 11261 First-Time Jobseekers)",
        notes: "Must be issued by the barangay where you resided for at least 6 months.",
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Register at the Official NBI Clearance Portal",
        description:
          "Create an account or sign in at clearance.nbi.gov.ph. First-time jobseekers should select the First Time Jobseekers option.",
        officialPortalLink: "https://clearance.nbi.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Select NBI Branch, Date, and Payment Reference",
        description:
          "Choose your nearest NBI Center and save the Reference Number. Regular applicants pay via authorized payment channels.",
      },
      {
        stepNumber: 3,
        title: "Complete Photo Capture and Biometrics",
        description:
          "Bring your two valid IDs and reference number on your appointment date for fingerprint scanning and photo capture.",
      },
      {
        stepNumber: 4,
        title: "Release of Clearance",
        description:
          "Clearances without a namesake 'Hit' are printed on the same day. If flagged with a 'Hit', return on the verification date stamped on your receipt.",
      },
    ],
    eligibilitySummary: "All Filipino citizens and foreign nationals requiring background verification in the Philippines.",
    processingTime: "Same day (No Hit: 30–60 minutes) | With 'Hit' verification: 5–10 working days",
    feesSummary:
      "Regular Multi-Purpose Clearance: PHP 130.00 (+ PHP 25.00 e-payment system fee) | First-Time Jobseeker (RA 11261): FREE (PHP 0.00).",
    sourceName: "National Bureau of Investigation (NBI)",
    sourceUrl: "https://clearance.nbi.gov.ph",
    contactInfo: {
      hotline: "(02) 8523-8231",
      hours: "Monday to Friday, 8:00 AM – 5:00 PM",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-philsys-national-id",
    module: "serbisyo",
    categorySlug: "civil-registry-ids",
    categoryName: "Civil Registry & National IDs",
    organizationSlug: "psa",
    organizationName: "Philippine Statistics Authority",
    organizationAcronym: "PSA",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "philsys-national-id-and-digital-id",
    title: "PhilSys National ID Registration & Official Digital National ID Access",
    summary:
      "How to register for the Philippine Identification System (PhilSys) and generate your official Digital National ID accepted by all government agencies and banks.",
    requirementsChecklist: [
      {
        id: "chk-phil-1",
        label: "Primary Supporting Document (PSA Birth Certificate, Philippine Passport, UMID, or LTO Student/Driver's License)",
        notes: "If unavailable, bring two secondary documents such as Barangay Clearance, Senior Citizen ID, or School ID.",
        isMandatory: true,
      },
      {
        id: "chk-phil-2",
        label: "Transaction Reference Number (TRN) Slip (For Digital National ID retrieval)",
        notes: "Access national-id.gov.ph using your demographic info and facial verification.",
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Visit Nearest PhilSys Registration Center",
        description:
          "Bring your original supporting document for demographic encoding and biometric capture (iris, fingerprints, front-facing photograph).",
        officialPortalLink: "https://philsys.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Keep Your Transaction Reference Number (TRN) Slip Safe",
        description:
          "Your 29-digit TRN allows you to track your physical card and claim your printed ePhilID.",
      },
      {
        stepNumber: 3,
        title: "Access Your Official Digital National ID Online",
        description:
          "Registered citizens can view and verify their official Digital National ID at national-id.gov.ph. Under BSP and PSA memoranda, the Digital National ID is a valid primary ID.",
        officialPortalLink: "https://national-id.gov.ph",
      },
    ],
    eligibilitySummary: "All Filipino citizens and resident aliens in the Philippines (including children aged 1 and above accompanied by a parent).",
    processingTime: "Biometrics capture: 20–30 minutes | Digital National ID: Instant once TRN is active",
    feesSummary: "FREE (PHP 0.00) for initial registration, ePhilID, and Digital National ID.",
    sourceName: "Philippine Statistics Authority — PhilSys",
    sourceUrl: "https://philsys.gov.ph",
    contactInfo: {
      hotline: "1388",
      email: "info@philsys.gov.ph",
      hours: "Monday to Saturday, 8:00 AM – 5:00 PM",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-philhealth-membership-konsulta",
    module: "serbisyo",
    categorySlug: "social-security-health",
    categoryName: "Social Security, Health & Housing",
    organizationSlug: "philhealth",
    organizationName: "Philippine Health Insurance Corporation",
    organizationAcronym: "PhilHealth",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "philhealth-pmrf-and-konsulta-registration",
    title: "PhilHealth Membership Registration (PMRF) & Free Konsulta Primary Care Package",
    summary:
      "Register for your PhilHealth Identification Number (PIN), update dependents on your PMRF, and choose an accredited PhilHealth Konsulta clinic for free consultations and laboratory tests.",
    requirementsChecklist: [
      {
        id: "chk-ph-1",
        label: "Duly accomplished PhilHealth Member Registration Form (PMRF)",
        notes: "Downloadable for free from philhealth.gov.ph or Local Health Insurance Offices (LHIO).",
        isMandatory: true,
      },
      {
        id: "chk-ph-2",
        label: "PSA Birth Certificate or Valid Government ID",
        notes: "If declaring legal spouse or children under 21 as dependents, attach marriage certificate / birth certificates.",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Complete the PhilHealth Member Registration Form (PMRF)",
        description:
          "Fill out personal details, member category (Employed, Informal Economy, Indigent, Senior Citizen, or First-Time Jobseeker), and legal dependents.",
        officialPortalLink: "https://www.philhealth.gov.ph/downloads/",
      },
      {
        stepNumber: 2,
        title: "Submit at Nearest PhilHealth LHIO or PhilHealth Member Portal",
        description:
          "Receive your Member Data Record (MDR) and PhilHealth ID card.",
      },
      {
        stepNumber: 3,
        title: "Register with a PhilHealth Konsulta Provider",
        description:
          "Log in to the PhilHealth Member Portal to select your preferred accredited Konsulta health facility for free primary care checkups, selected labs, and maintenance medicines.",
        officialPortalLink: "https://memberinquiry.philhealth.gov.ph/member/",
      },
    ],
    eligibilitySummary: "All Filipino citizens are automatically covered under RA 11223 (Universal Health Care Act).",
    processingTime: "Walk-in MDR & PIN issuance: 15–45 minutes",
    feesSummary: "Registration, MDR, and PhilHealth ID issuance are FREE (PHP 0.00).",
    sourceName: "Philippine Health Insurance Corporation (PhilHealth)",
    sourceUrl: "https://www.philhealth.gov.ph/members/",
    contactInfo: {
      hotline: "(02) 8662-2588",
      email: "actioncenter@philhealth.gov.ph",
      hours: "24/7 Hotline Support",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-sss-number-online",
    module: "serbisyo",
    categorySlug: "social-security-health",
    categoryName: "Social Security, Health & Housing",
    organizationSlug: "sss",
    organizationName: "Social Security System",
    organizationAcronym: "SSS",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "sss-number-online-application",
    title: "SSS Number Online Application & Permanent Membership Conversion",
    summary:
      "How to get your Social Security (SS) Number online for employment or voluntary membership and convert your status from Temporary to Permanent.",
    requirementsChecklist: [
      {
        id: "chk-sss-1",
        label: "Active personal email address and mobile number",
        isMandatory: true,
      },
      {
        id: "chk-sss-2",
        label: "Scanned copy or clear photo of PSA Birth Certificate or Philippine Passport",
        notes: "Uploaded online or presented at an SSS branch to convert SS Number status to Permanent.",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Apply for an SS Number via the Official SSS Website",
        description:
          "Visit sss.gov.ph and select 'Apply for an SS Number Online'. Verify the activation link sent to your email.",
        officialPortalLink: "https://www.sss.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Upload Supporting Birth/Identity Document",
        description:
          "Upload your PSA Birth Certificate or Passport during the online application and save your Personal Record Form (E-1/E-6) and SS Number slip.",
      },
      {
        stepNumber: 3,
        title: "Create Your My.SSS Portal Account",
        description:
          "Once your SS number is active, register on My.SSS to monitor employer contributions, salary/calamity loan eligibility, and benefit claims.",
      },
    ],
    eligibilitySummary: "Private sector employees, self-employed individuals, OFWs, non-working spouses, and job applicants.",
    processingTime: "Online SS Number generation: 10–15 minutes",
    feesSummary: "FREE (PHP 0.00) application.",
    sourceName: "Social Security System (SSS)",
    sourceUrl: "https://www.sss.gov.ph",
    contactInfo: {
      hotline: "1455",
      email: "usssaptayo@sss.gov.ph",
      hours: "Monday to Friday, 8:00 AM – 5:00 PM",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-pagibig-virtual-mp2",
    module: "pera",
    categorySlug: "financial-literacy",
    categoryName: "Financial Planning & Calculators",
    organizationSlug: "pag-ibig",
    organizationName: "Home Development Mutual Fund",
    organizationAcronym: "Pag-IBIG",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "pag-ibig-mid-and-mp2-savings-guide",
    title: "Pag-IBIG MID Number Registration & Modified Pag-IBIG II (MP2) Government-Backed Savings",
    summary:
      "Official guide to getting your Pag-IBIG Membership ID (MID) and opening a tax-free, government-guaranteed MP2 Savings account starting at PHP 500.",
    requirementsChecklist: [
      {
        id: "chk-pag-1",
        label: "Valid Government ID & Active Pag-IBIG MID Number",
        notes: "New members can register via Virtual Pag-IBIG for a permanent MID number.",
        isMandatory: true,
      },
      {
        id: "chk-pag-2",
        label: "Minimum PHP 500.00 initial deposit (for MP2 voluntary savings)",
        notes: "Dividends are tax-free and backed by the Philippine government.",
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Register on Virtual Pag-IBIG",
        description:
          "Visit pagibigfundservices.com/virtualpagibig to get your permanent MID number or create your online account.",
        officialPortalLink: "https://www.pagibigfundservices.com/virtualpagibig/",
      },
      {
        stepNumber: 2,
        title: "Apply for an MP2 Savings Account Number (Optional)",
        description:
          "Under 'Be a Member' or inside Virtual Pag-IBIG, generate your 12-digit MP2 account number and select either annual dividend payout or 5-year compounded savings.",
      },
    ],
    eligibilitySummary: "All active and former Pag-IBIG Fund members, including OFWs and voluntary savers.",
    processingTime: "MID Verification: 1–2 working days | MP2 Account Number: Instant online",
    feesSummary: "Membership registration is FREE (PHP 0.00). MP2 minimum deposit is PHP 500 per remittance.",
    sourceName: "Home Development Mutual Fund (Pag-IBIG Fund)",
    sourceUrl: "https://www.pagibigfund.gov.ph/Membership_ModifiedPagIBIG2.html",
    contactInfo: {
      hotline: "(02) 8724-4244",
      email: "contactus@pagibigfund.gov.ph",
      hours: "24/7 Hotline & Chat Support",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-aral-tesda-online-program",
    module: "aral",
    categorySlug: "scholarships-higher-ed",
    categoryName: "Scholarships & Free Education",
    organizationSlug: "tesda",
    organizationName: "Technical Education and Skills Development Authority",
    organizationAcronym: "TESDA",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "tesda-online-program-free-courses",
    title: "TESDA Online Program (TOP) — 150+ Free Self-Paced Technical & Digital Courses",
    summary:
      "Enroll in free open educational courses from TESDA covering Web Development, Caregiving, Bread & Pastry Production, Bookkeeping, Agriculture, and Financial Literacy.",
    requirementsChecklist: [
      {
        id: "chk-top-1",
        label: "Active email address for e-TESDA account creation",
        isMandatory: true,
      },
      {
        id: "chk-top-2",
        label: "Smartphone or computer with internet connection",
        notes: "Courses are self-paced and issue a free digital Certificate of Completion.",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Create a Free Account at e-tesda.gov.ph",
        description:
          "Visit the official TESDA Online Program portal and activate your account via email.",
        officialPortalLink: "https://e-tesda.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Browse Sectors and Enroll in Any Course",
        description:
          "Choose from Information & Communications Technology, Tourism, Cookery, Automotive, Entrepreneurship, or Healthcare.",
      },
      {
        stepNumber: 3,
        title: "Download Certificate & Optional NC Assessment",
        description:
          "Complete the module quizzes to download your Certificate of Completion. For full National Certification (NC II), schedule a competency assessment at an accredited TESDA center.",
      },
    ],
    eligibilitySummary: "Open to all Filipinos — students, workers, OFWs, out-of-school youth, and career shifters.",
    processingTime: "Self-paced (Instant enrollment)",
    feesSummary: "100% FREE (PHP 0.00) online tuition and digital Certificate of Completion.",
    sourceName: "TESDA Online Program (e-TESDA)",
    sourceUrl: "https://e-tesda.gov.ph",
    contactInfo: {
      hotline: "(02) 8887-7777",
      email: "tesdaonlineprogram@tesda.gov.ph",
      hours: "24/7 Self-Paced Online Portal",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-kaligtasan-go-bag-first-aid",
    module: "kaligtasan",
    categorySlug: "emergency-disaster-response",
    categoryName: "Emergency Hotlines & Disaster Preparedness",
    organizationSlug: "ndrrmc",
    organizationName: "National Disaster Risk Reduction and Management Council",
    organizationAcronym: "NDRRMC",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "ndrrmc-72-hour-emergency-go-bag-and-first-aid",
    title: "NDRRMC & Red Cross 72-Hour Family Emergency Go-Bag & Typhoon/Earthquake Preparedness Guide",
    summary:
      "Official household disaster preparedness checklist for typhoons, floods, and earthquakes, plus basic emergency first-aid response guidelines.",
    requirementsChecklist: [
      {
        id: "chk-gobag-1",
        label: "Drinking water (at least 3 liters per person per day for 3 days) & ready-to-eat non-perishable food",
        isMandatory: true,
      },
      {
        id: "chk-gobag-2",
        label: "First-aid kit (sterile gauze, povidone-iodine, adhesive bandages, paracetamol, oral rehydration salts, and 7-day supply of personal prescription maintenance medicines)",
        isMandatory: true,
      },
      {
        id: "chk-gobag-3",
        label: "Waterproof pouch containing original/copies of Government IDs, PSA certificates, PhilHealth MDR, and emergency cash in small bills",
        isMandatory: true,
      },
      {
        id: "chk-gobag-4",
        label: "Flashlight, emergency whistle, battery-powered AM/FM radio, fully charged powerbank, and extra clothes/rain gear",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Know Your Barangay Evacuation Center & Hazard Map",
        description:
          "Check flood, storm surge, and fault line hazards for your exact address using the DOST GeoRiskPH / HazardHunterPH platform.",
        officialPortalLink: "https://hazardhunter.georisk.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Pre-Emptive Evacuation During Tropical Cyclone Wind Signals & Heavy Rainfall",
        description:
          "Do not wait for nighttime or chest-deep flooding. Follow LGU and MDRRMO pre-emptive evacuation advisories immediately.",
      },
      {
        stepNumber: 3,
        title: "Earthquake Protocol: Duck, Cover, and Hold",
        description:
          "Protect your head and neck under sturdy furniture until shaking stops. Evacuate calmly using stairs (never elevators) to an open area away from glass, trees, and power lines.",
      },
    ],
    eligibilitySummary: "Essential preparedness guide for all households, schools, and workplaces across the Philippines.",
    processingTime: "Immediate action checklist",
    feesSummary: "Free public safety guide",
    sourceName: "NDRRMC / Office of Civil Defense & DOST-PHIVOLCS",
    sourceUrl: "https://ndrrmc.gov.ph",
    contactInfo: {
      hotline: "911 / 143",
      hours: "24/7 Emergency Operations",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-serbisyo-pagibig-housing",
    module: "serbisyo",
    categorySlug: "housing-pagibig",
    categoryName: "Housing & Pag-IBIG Services",
    organizationSlug: "pag-ibig",
    organizationName: "Home Development Mutual Fund",
    organizationAcronym: "Pag-IBIG",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "pag-ibig-affordable-housing-loan-guide",
    title: "Pag-IBIG Fund Regular & Affordable Housing Loan Application Guide",
    summary:
      "Official documentary requirements, eligibility rules (at least 24 monthly savings), and Virtual Pag-IBIG application steps for home purchase, construction, or improvement.",
    requirementsChecklist: [
      {
        id: "chk-hsg-1",
        label: "Duly accomplished Housing Loan Application (HLA) Form with 1x1 ID photo",
        isMandatory: true,
      },
      {
        id: "chk-hsg-2",
        label: "Proof of Income (Notarized Certificate of Employment & Compensation, latest ITR / BIR Form 2316, or 1-month payslip)",
        isMandatory: true,
      },
      {
        id: "chk-hsg-3",
        label: "One (1) valid Government-issued Primary ID of principal borrower, spouse, and seller",
        isMandatory: true,
      },
      {
        id: "chk-hsg-4",
        label: "Certified True Copy of Transfer Certificate of Title (TCT) / Condominium Certificate of Title (CCT) & Updated Tax Declaration",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Verify 24 Monthly Membership Savings on Virtual Pag-IBIG",
        description:
          "Ensure you have at least 24 monthly Pag-IBIG Regular Savings remittances (lump-sum completion is permitted for first-time housing borrowers).",
        officialPortalLink: "https://www.pagibigfundservices.com/virtualpagibig/",
      },
      {
        stepNumber: 2,
        title: "Submit Housing Loan Application Online or at a Pag-IBIG Housing Business Center",
        description:
          "Upload complete documentary requirements via Virtual Pag-IBIG or file directly at the nearest Pag-IBIG Housing Business Center.",
      },
      {
        stepNumber: 3,
        title: "Receive Notice of Approval (NOA) & Complete Title Annotation",
        description:
          "Upon credit and collateral evaluation approval, sign the loan and mortgage documents and complete Registry of Deeds annotation within 90 days.",
      },
    ],
    eligibilitySummary:
      "Active Pag-IBIG members with at least 24 monthly contributions, not more than 65 years old at the date of application (and not more than 70 at loan maturity), with legal capacity to acquire property and no foreclosed/defaulted Pag-IBIG housing loan.",
    processingTime: "Approximately 17–20 working days upon submission of complete requirements",
    feesSummary:
      "Processing Fee: PHP 1,000 upon filing + PHP 2,000 upon loan takeout (per official Pag-IBIG Housing Loan guidelines).",
    sourceName: "Home Development Mutual Fund (Pag-IBIG Fund)",
    sourceUrl: "https://www.pagibigfund.gov.ph/Availmentofnewloan.html",
    contactInfo: {
      hotline: "(02) 8724-4244",
      email: "contactus@pagibigfund.gov.ph",
      hours: "24/7 Contact Center",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "res-serbisyo-dti-bnrs-lgu-permit",
    module: "serbisyo",
    categorySlug: "lgu-business-registration",
    categoryName: "Local Government & Business Registration",
    organizationSlug: "dti",
    organizationName: "Department of Trade and Industry / Local Government BPLO",
    organizationAcronym: "DTI / LGU",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "dti-business-name-and-lgu-barangay-clearance-guide",
    title: "DTI Sole Proprietorship Business Name (BNRS) & Barangay / LGU Business Permit Guide",
    summary:
      "Step-by-step requirements for registering a Sole Proprietorship Business Name on DTI BNRS, securing a Barangay Business Clearance, and applying for BMBE (RA 9178) registration.",
    requirementsChecklist: [
      {
        id: "chk-dti-1",
        label: "One (1) valid Government-issued ID of the Sole Proprietor (Filipino citizen, 18+ years old)",
        isMandatory: true,
      },
      {
        id: "chk-dti-2",
        label: "Three (3) proposed Business Name options and territorial scope selection (Barangay, City/Municipality, Regional, or National)",
        isMandatory: true,
      },
      {
        id: "chk-dti-3",
        label: "DTI Certificate of Business Name Registration + Proof of Business Address (Lease Contract or Land Title/Tax Declaration) for LGU BPLO",
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Register Business Name Online at DTI BNRS (bnrs.dti.gov.ph)",
        description:
          "Search name availability, select your territorial scope, and pay the statutory registration fee within 5 calendar days to download your Certificate of Business Name Registration.",
        officialPortalLink: "https://bnrs.dti.gov.ph",
      },
      {
        stepNumber: 2,
        title: "Secure Barangay Business Clearance & Mayor's Permit (eBOSS)",
        description:
          "Submit your DTI Certificate to your Barangay Hall or city/municipal Electronic Business One-Stop Shop (eBOSS per RA 11032 Ease of Doing Business Act).",
      },
      {
        stepNumber: 3,
        title: "Register with BIR (Form 1901) & Optional BMBE Certificate at DTI Negosyo Center",
        description:
          "Micro enterprises with total assets not exceeding PHP 3,000,000 (excluding land) may apply for a free Barangay Micro Business Enterprise (BMBE) Certificate of Authority under RA 9178.",
      },
    ],
    eligibilitySummary:
      "Filipino citizens at least 18 years of age establishing a Sole Proprietorship or micro/small enterprise.",
    processingTime: "DTI BNRS Online: 15–30 minutes | LGU eBOSS: 1–3 working days per RA 11032",
    feesSummary:
      "DTI BNRS Fee by Scope: Barangay PHP 200 | City/Municipality PHP 500 | Regional PHP 1,000 | National PHP 2,000 (+ PHP 30 Documentary Stamp Tax).",
    sourceName: "Department of Trade and Industry (DTI BNRS)",
    sourceUrl: "https://bnrs.dti.gov.ph",
    contactInfo: {
      hotline: "1-384 (1-DTI)",
      email: "bnrshelpdesk@dti.gov.ph",
      hours: "Monday to Friday, 8:00 AM – 5:00 PM",
    },
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_OPPORTUNITIES: OpportunityRecord[] = [
  {
    id: "opp-job-philjobnet-nurse-doh",
    type: "job",
    categorySlug: "government-private-jobs",
    organizationSlug: "dole",
    organizationName: "DOLE PhilJobNet / Public Health Facilities",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "public-health-nurse-and-allied-health-csc-dole",
    title: "Public Health Nurse I / Allied Health Professionals (CSC & DOH Deployment)",
    description:
      "Verified government career openings for licensed nurses, medical technologists, and midwives across DOH regional hospitals and Local Government Health Units.",
    requirements: [
      "Valid PRC Professional License (RA 1080 Eligibility)",
      "Updated Personal Data Sheet (CS Form No. 212, Revised 2017)",
      "Transcript of Records and Certificate of Board Rating",
      "NBI Clearance and PSA Birth Certificate",
    ],
    compensationOrBenefit: "Salary Grade 15 (Approx. PHP 36,619/month under SSL V) + Statutory GSIS, PhilHealth, Pag-IBIG, and Hazard Pay",
    employmentType: "Full-Time / Permanent or Contract of Service",
    applicationUrl: "https://csc.gov.ph/career/",
    deadlineAt: "2026-12-15",
    isRemote: false,
    sourceName: "Civil Service Commission (CSC) Career Portal",
    sourceUrl: "https://csc.gov.ph/career/",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "opp-job-philjobnet-customer-it",
    type: "job",
    categorySlug: "government-private-jobs",
    organizationSlug: "dole",
    organizationName: "Department of Labor and Employment (PhilJobNet)",
    regionCode: "NCR",
    regionName: "National Capital Region (Metro Manila)",
    slug: "dole-philjobnet-verified-it-and-admin-openings",
    title: "Administrative Officer & Junior IT Support Specialist (DOLE-PESO Verified Employers)",
    description:
      "Accredited private and public sector job vacancies vetted through the Department of Labor and Employment's official PhilJobNet labor market portal.",
    requirements: [
      "Senior High School graduate, TESDA NC II holder, or College graduate depending on track",
      "Basic computer literacy, documentation, and communication skills",
      "SSS, PhilHealth, and Pag-IBIG membership numbers",
    ],
    compensationOrBenefit: "PHP 20,000 – PHP 32,000/month + Mandatory 13th Month Pay & Statutory Benefits",
    employmentType: "Full-Time (Hybrid / On-Site)",
    applicationUrl: "https://philjobnet.gov.ph",
    deadlineAt: "2026-12-20",
    isRemote: true,
    sourceName: "DOLE PhilJobNet Official Portal",
    sourceUrl: "https://philjobnet.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "opp-scholarship-ched-cmsp",
    type: "scholarship",
    categorySlug: "scholarships-higher-ed",
    organizationSlug: "ched",
    organizationName: "Commission on Higher Education (CHED)",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "ched-merit-scholarship-program-cmsp",
    title: "CHED Merit Scholarship Program (CMSP) & Tulong Dunong Program (TDP-TES)",
    description:
      "Financial educational grants for incoming and continuing Filipino undergraduate students enrolled in authorized public or private Higher Education Institutions.",
    requirements: [
      "Filipino citizen and graduating Senior High School student (GWA at least 93% for Half Merit, 96% for Full Merit)",
      "Combined annual gross income of parents/guardian not exceeding PHP 400,000 (or BIR Certificate of Tax Exemption / Barangay Indigency)",
      "Certified true copy of Grade 11 and Grade 12 report cards",
    ],
    compensationOrBenefit: "Up to PHP 60,000 – PHP 120,000 per academic year covering tuition, stipend, and book allowance",
    employmentType: "Academic Scholarship Grant",
    applicationUrl: "https://ched.gov.ph/merit-scholarship/",
    deadlineAt: "2026-12-31",
    isRemote: false,
    sourceName: "Commission on Higher Education (CHED) / UniFAST",
    sourceUrl: "https://unifast.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "opp-training-tesda-twsp",
    type: "training",
    categorySlug: "skills-training-tesda",
    organizationSlug: "tesda",
    organizationName: "Technical Education and Skills Development Authority",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "tesda-twsp-and-step-free-scholarship-training",
    title: "TESDA Training for Work Scholarship Program (TWSP) & Special Training for Employment (STEP)",
    description:
      "Free hands-on technical-vocational training with daily training allowance and free National Certificate (NC II / NC III) assessment at TESDA Technology Institutions.",
    requirements: [
      "At least 18 years old at the time of completion of training",
      "PSA Birth Certificate and High School / Senior High School Diploma or ALS Certificate",
      "Valid ID and Barangay Clearance",
    ],
    compensationOrBenefit: "Free Tuition + Free National Competency Assessment + PHP 160/day Training Support Fund + Starter Toolkits (for STEP)",
    employmentType: "Vocational Scholarship & Certification",
    applicationUrl: "https://bsrs.tesda.gov.ph",
    deadlineAt: "2026-12-31",
    isRemote: false,
    sourceName: "TESDA Biometric-Enabled Scholarship Registration System (BSRS)",
    sourceUrl: "https://www.tesda.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_ASSISTANCE_PROGRAMS: AssistanceProgramRecord[] = [
  {
    id: "assist-dswd-aics",
    organizationSlug: "dswd",
    organizationName: "Department of Social Welfare and Development (DSWD)",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "dswd-aics-medical-burial-educational-aid",
    programName: "DSWD Assistance to Individuals in Crisis Situations (AICS)",
    programType: "medical",
    description:
      "Immediate social safety net providing medical, hospital bill Guarantee Letters (GL), laboratory assistance, burial/funeral support, transportation, and educational assistance to families experiencing unexpected crisis.",
    benefitSummary:
      "Outright cash assistance (up to PHP 10,000 depending on social worker assessment) or Guarantee Letter up to PHP 150,000 addressed directly to the hospital/pharmacy/funeral parlor.",
    eligibilityCriteria: [
      "Indigent, vulnerable, marginalized, or informal sector Filipino citizen experiencing a medical, death, or family crisis",
      "Assessed by a licensed DSWD Social Worker at a DSWD Field Office, Satellite Office, or Malasakit Center",
    ],
    requiredDocuments: [
      "Valid ID of the client/representative and the patient/beneficiary",
      "Barangay Certificate of Indigency or Certificate of Residency",
      "For Medical/Hospital Aid: Clinical Abstract / Medical Certificate (issued within the last 3 months with physician's license number), Final Hospital Bill or Doctor's Prescription with price quotation",
      "For Burial Aid: Registered Death Certificate and Funeral Contract",
    ],
    howToApply: [
      "Prepare original and photocopies of your Valid ID, Medical/Crisis Documents, and Barangay Certificate.",
      "Proceed to the nearest DSWD Field Office Crisis Intervention Unit (CIU), SWAD Satellite Office, or hospital Malasakit Center.",
      "Undergo screening and social case interview with the DSWD Social Worker.",
      "Claim the approved outright cash payout or Guarantee Letter (GL) at the releasing window.",
    ],
    sourceName: "Department of Social Welfare and Development (DSWD)",
    sourceUrl: "https://aics.dswd.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "assist-doh-malasakit-center",
    organizationSlug: "philhealth",
    organizationName: "DOH Malasakit Centers / PCSO / PhilHealth / DSWD",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "malasakit-center-one-stop-hospital-bill-assistance",
    programName: "Malasakit Center One-Stop Medical & Hospitalization Financial Assistance (RA 11463)",
    programType: "medical",
    description:
      "Under the Malasakit Centers Act (RA 11463), all DOH-run hospitals and PGH host a single one-stop office combining PhilHealth, PCSO, DSWD, and DOH Medical Assistance to Indigent and Financially Incapacitated Patients (MAIFIP).",
    benefitSummary:
      "Covers out-of-pocket inpatient bills, chemotherapy, dialysis, implant devices, and diagnostic procedures in participating public hospitals toward zero-balance billing for indigent wards.",
    eligibilityCriteria: [
      "Inpatient or outpatient in any of the 160+ DOH-retained hospitals, specialty hospitals, or Philippine General Hospital (PGH)",
      "Financially incapacitated or indigent patient assessed via the Unified Intake Sheet",
    ],
    requiredDocuments: [
      "Statement of Account (SOA) or Official Price Quotation from the public hospital",
      "Medical Abstract or Clinical Summary signed by the attending physician",
      "Valid ID of the patient and authorized family representative",
    ],
    howToApply: [
      "Ask your hospital billing section for your updated Statement of Account (SOA) or diagnostic request.",
      "Proceed directly to the Malasakit Center inside the public hospital (no need to travel between separate agency offices).",
      "Complete the single Unified Intake Sheet with the medical social worker.",
      "Receive the consolidated PhilHealth deduction + DSWD/PCSO/DOH MAIFIP coverage directly credited to your hospital bill.",
    ],
    sourceName: "Department of Health (DOH) — Malasakit Program Office",
    sourceUrl: "https://doh.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "assist-dole-tupad",
    organizationSlug: "dole",
    organizationName: "Department of Labor and Employment (DOLE)",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "dole-tupad-emergency-employment-program",
    programName: "DOLE TUPAD (Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers)",
    programType: "livelihood",
    description:
      "Community-based package of assistance that provides emergency employment for displaced workers, underemployed, and seasonal workers for a minimum of 10 to a maximum of 30 days.",
    benefitSummary:
      "100% of the prevailing highest minimum wage in the region per day worked + free GSIS group micro-insurance + Basic Orientation on Safety and Health + PPE (T-shirt, hat).",
    eligibilityCriteria: [
      "Displaced, underemployed, self-employed, or seasonal informal sector worker (e.g., vendors, transport drivers, farmers, fisherfolk)",
      "Only one (1) member per household may avail within a calendar year, except in cases of calamity",
    ],
    requiredDocuments: [
      "Valid ID or Barangay Certification of Residency / Displaced Status",
      "Accomplished TUPAD Beneficiary Profile Form via your LGU Public Employment Service Office (PESO)",
    ],
    howToApply: [
      "Coordinate directly with your city or municipal Public Employment Service Office (PESO) or DOLE Provincial/Field Office.",
      "Submit your beneficiary profile form for validation.",
      "Attend the mandatory Basic Safety and Health orientation before starting community work.",
    ],
    sourceName: "Department of Labor and Employment (DOLE)",
    sourceUrl: "https://www.dole.gov.ph/tupad-program/",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "assist-sss-pagibig-calamity-loan",
    organizationSlug: "pag-ibig",
    organizationName: "SSS & Pag-IBIG Fund",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    slug: "sss-and-pag-ibig-calamity-loan-assistance",
    programName: "SSS & Pag-IBIG Calamity Loan Programs for Disaster-Affected Workers",
    programType: "calamity",
    description:
      "Low-interest emergency financial relief for active SSS and Pag-IBIG members residing or working in areas declared under a State of Calamity by the NDRRMC or Sangguniang Bayan/Panlungsod.",
    benefitSummary:
      "Pag-IBIG: Up to 80% of total Regular Savings at 5.95% per annum | SSS: Up to 1 monthly salary credit (up to PHP 20,000) payable in 24 months.",
    eligibilityCriteria: [
      "Residing in an LGU officially declared under a State of Calamity",
      "At least 24 monthly contributions for Pag-IBIG (or 36 monthly contributions for SSS, with 6 in the last 12 months)",
    ],
    requiredDocuments: [
      "Active My.SSS or Virtual Pag-IBIG online account",
      "Disbursement account (Loyalty Card Plus, UMID-ATM, or PESONet-accredited bank account)",
    ],
    howToApply: [
      "Log in to Virtual Pag-IBIG or the My.SSS Member Portal within 90 days of the calamity declaration.",
      "Select 'Apply for Calamity Loan' and verify your residential address and disbursement bank account.",
      "Wait for employer certification (if employed) and receive proceeds directly via bank/card transfer.",
    ],
    sourceName: "Pag-IBIG Fund & Social Security System",
    sourceUrl: "https://www.pagibigfund.gov.ph/STL_Calamity.html",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_BAYANIHAN_POSTS: BayanihanPostRecord[] = [
  {
    id: "bay-1",
    postType: "volunteer_call",
    organizationName: "Philippine Red Cross — National Headquarters & Chapters",
    regionCode: "NATIONAL",
    regionName: "Nationwide (All Regions)",
    cityMunicipality: "Mandaluyong City & Provincial Chapters",
    slug: "red-cross-143-community-disaster-volunteers",
    title: "Red Cross 143 Community Disaster & First-Aid Volunteer Enrollment",
    summary:
      "Join the Philippine Red Cross 143 municipal/barangay volunteer network to receive free First-Aid training and assist in community blood drives, welfare desks, and typhoon response.",
    urgencyLevel: "high",
    itemsOrSkillsNeeded: [
      "Community Disaster Response Volunteers",
      "Licensed Health Workers & First-Aiders",
      "Logistics & Relief Repacking Volunteers",
    ],
    dropOffOrMeetingPoint: "37 EDSA corner Boni Avenue, Mandaluyong City (or nearest PRC Provincial Chapter)",
    contactChannel: "Hotline 143 / volunteer@redcross.org.ph",
    sourceName: "Philippine Red Cross",
    sourceUrl: "https://redcross.org.ph/volunteer/",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "bay-2",
    postType: "donation_offer",
    organizationName: "DSWD National Resource Operations Center (NROC)",
    regionCode: "NCR",
    regionName: "National Capital Region (Metro Manila)",
    cityMunicipality: "Pasay City",
    slug: "dswd-nroc-family-food-pack-repacking-volunteers",
    title: "DSWD NROC Family Food Pack (FFP) Repacking & Verified Relief Drive",
    summary:
      "Official volunteer and in-kind donation coordination hub of the Department of Social Welfare and Development preparing standardized Family Food Packs for typhoon-affected provinces.",
    urgencyLevel: "critical",
    itemsOrSkillsNeeded: [
      "Relief Box Assembly & Sorting Volunteers (8:00 AM – 5:00 PM shifts)",
      "Sealed drinking water (5L/6L bottles)",
      "Hygiene kits and sleeping mats (must be coordinated with DSWD Donation Desk)",
    ],
    dropOffOrMeetingPoint: "DSWD National Resource Operations Center (NROC), Chapel Road, Brgy. 195, Pasay City",
    contactChannel: "(02) 8852-8081 / DSWD Disaster Response Management Bureau",
    sourceName: "DSWD Disaster Response Management Bureau",
    sourceUrl: "https://drmb.dswd.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "bay-3",
    postType: "assistance_request",
    organizationName: "Bicol Regional DRRMC & LGU Naga Social Welfare Desk",
    regionCode: "Region V",
    regionName: "Bicol Region",
    cityMunicipality: "Naga City, Camarines Sur",
    slug: "bicol-school-supplies-and-clean-water-recovery",
    title: "Post-Flood Public School Learning Kits & Potable Water Filtration Support",
    summary:
      "Verified LGU-coordinated community assistance call for flood-affected elementary pupils and barangay health stations in low-lying riverine communities.",
    urgencyLevel: "high",
    itemsOrSkillsNeeded: [
      "Elementary notebooks, pencils, and waterproof school bags",
      "Aquatabs / potable water purification tablets",
      "Volunteer teachers for weekend reading catch-up sessions",
    ],
    dropOffOrMeetingPoint: "Naga City Hall Public Safety & CSWDO Receiving Desk, J. Miranda Ave, Naga City",
    contactChannel: "Naga City Command Center / (054) 473-2240",
    sourceName: "LGU Naga City Official Portal",
    sourceUrl: "https://www2.naga.gov.ph",
    verificationStatus: "officially_verified",
    status: "published",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_EMERGENCY_HOTLINES: EmergencyHotlineRecord[] = [
  {
    id: "hot-911",
    agencyName: "National Emergency Hotline (DILG / PNP / BFP)",
    acronym: "911",
    category: "national_emergency",
    primaryNumber: "911",
    secondaryNumbers: ["(02) 8925-9111"],
    coverage: "Nationwide (Police, Fire, Medical Emergency)",
    operatingHours: "24/7 Toll-Free on Landline & Mobile",
    sourceUrl: "https://dilg.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-143",
    agencyName: "Philippine Red Cross Emergency & Ambulance",
    acronym: "PRC 143",
    category: "medical_red_cross",
    primaryNumber: "143",
    secondaryNumbers: ["(02) 8790-2300"],
    coverage: "Nationwide Chapters (Ambulance, Blood, Rescue)",
    operatingHours: "24/7 Emergency Operations",
    sourceUrl: "https://redcross.org.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-ndrrmc",
    agencyName: "National Disaster Risk Reduction and Management Council",
    acronym: "NDRRMC",
    category: "disaster_weather",
    primaryNumber: "(02) 8911-5061",
    secondaryNumbers: ["(02) 8911-1406", "(02) 8912-2665", "(02) 8912-5668"],
    coverage: "Nationwide Disaster Operations Center",
    operatingHours: "24/7 Operations Center",
    sourceUrl: "https://ndrrmc.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-ncmh",
    agencyName: "National Center for Mental Health Crisis Hotline",
    acronym: "NCMH 1553",
    category: "medical_red_cross",
    primaryNumber: "1553",
    secondaryNumbers: ["0917-899-8727", "0966-351-4518", "0919-057-1553"],
    coverage: "Nationwide Confidential Mental Health Support",
    operatingHours: "24/7 Free & Confidential (Luzon Landline 1553)",
    sourceUrl: "https://ncmh.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-pcg",
    agencyName: "Philippine Coast Guard Maritime Search & Rescue",
    acronym: "PCG",
    category: "disaster_weather",
    primaryNumber: "(02) 8527-8481",
    secondaryNumbers: ["0917-PCG-DOTR", "(02) 8527-3877"],
    coverage: "Nationwide Flood & Maritime Rescue",
    operatingHours: "24/7 Command Center",
    sourceUrl: "https://coastguard.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-8888",
    agencyName: "Citizens' Complaint Center (Office of the President)",
    acronym: "8888",
    category: "social_welfare",
    primaryNumber: "8888",
    secondaryNumbers: ["1348 (Anti-Red Tape Authority)"],
    coverage: "Nationwide Government Red Tape & Fixer Reporting",
    operatingHours: "24/7 Public Assistance",
    sourceUrl: "https://8888.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "hot-pnp-acg",
    agencyName: "PNP Anti-Cybercrime Group (Scam & Online Fraud)",
    acronym: "PNP-ACG",
    category: "law_enforcement",
    primaryNumber: "(02) 8723-0401",
    secondaryNumbers: ["0998-598-8116", "1326 (CICC Cybercrime Hotline)"],
    coverage: "Nationwide Job Scam, Phishing & Online Fraud Reporting",
    operatingHours: "24/7 Action Center",
    sourceUrl: "https://acg.pnp.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
];

export const VERIFIED_EVACUATION_CENTERS: EvacuationCenterRecord[] = [
  {
    id: "evac-qc-1",
    name: "Quezon City Evacuation Center — Barangay Bagong Silangan Multi-Purpose Hall",
    regionCode: "NCR",
    cityMunicipality: "Quezon City",
    barangay: "Barangay Bagong Silangan",
    address: "Villamor St., Brgy. Bagong Silangan, Quezon City",
    capacityEstimate: "250 families (Modular tents, breastfeeding room, community kitchen)",
    facilities: ["Modular Family Tents", "Potable Water Station", "Medical Triage Desk", "Child-Friendly Space", "Generator Backup"],
    managingLgu: "Quezon City DRRMO (Hotline 122)",
    contactNumber: "122 / (02) 8927-5914",
    sourceUrl: "https://quezoncity.gov.ph/departments/quezon-city-disaster-risk-reduction-and-management-office/",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "evac-marikina-1",
    name: "Marikina Elementary School & Sto. Niño Dedicated Evacuation Complex",
    regionCode: "NCR",
    cityMunicipality: "Marikina City",
    barangay: "Barangay Sta. Elena / Sto. Niño",
    address: "Shoe Avenue, Brgy. Sta. Elena, Marikina City",
    capacityEstimate: "400 families (Pre-registered camp management system)",
    facilities: ["Segregated Washrooms", "Community Kitchen", "24/7 Nurse Station", "Pet Evacuation Area"],
    managingLgu: "Marikina City Rescue 161",
    contactNumber: "161 / (02) 8646-2436",
    sourceUrl: "https://marikina.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "evac-albay-1",
    name: "Guinobatan-Legazpi Regional Permanent Evacuation Center",
    regionCode: "Region V",
    cityMunicipality: "Legazpi City / Guinobatan, Albay",
    barangay: "Mauraro / Homapon",
    address: "Provincial Disaster Complex Road, Albay",
    capacityEstimate: "350 families (Typhoon & Mayon Volcanic Hazard Resilient)",
    facilities: ["Ashfall-sealed Ventilation", "Water Filtration", "DSWD Relief Storage", "First-Aid Post"],
    managingLgu: "APSEMO / Albay Provincial DRRMO",
    contactNumber: "(052) 480-4388",
    sourceUrl: "https://ndrrmc.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
  {
    id: "evac-cebu-1",
    name: "Cebu City Sports Center & Abellana Regional Evacuation Hub",
    regionCode: "Region VII",
    cityMunicipality: "Cebu City",
    barangay: "Sambag I",
    address: "Osmeña Blvd, Cebu City, Cebu",
    capacityEstimate: "500 families",
    facilities: ["Covered Gymnasium", "Mobile Charging Station", "Red Cross Welfare Desk", "Potable Water"],
    managingLgu: "Cebu City DRRMO",
    contactNumber: "(032) 262-1424 / 911",
    sourceUrl: "https://www.cebucity.gov.ph",
    verificationStatus: "officially_verified",
    lastVerifiedAt: "2026-11-01",
  },
];

export const ACTIVE_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: "ann-ra11261",
    title: "RA 11261 Reminder: Free Pre-Employment Documents for First-Time Jobseekers",
    summary:
      "Qualified first-time jobseekers can claim their NBI Clearance, PSA Birth Certificate, Police Clearance, Barangay Clearance, and CSC/PRC documents FREE of charge upon presenting a Barangay First-Time Jobseeker Certificate.",
    severity: "info",
    relatedModule: "trabaho",
    regionCode: "NATIONAL",
    sourceName: "Department of Labor and Employment (DOLE)",
    sourceUrl: "https://www.dole.gov.ph",
    verificationStatus: "officially_verified",
    startsAt: "2026-10-01",
    expiresAt: "2027-12-31",
    isActive: true,
  },
  {
    id: "ann-digital-id",
    title: "PSA & BSP Directive: Digital National ID Must Be Accepted Without Physical Card",
    summary:
      "Under BSP Memorandum No. M-2024-026 and PSA Advisories, all government offices, banks, and financial institutions are mandated to honor the official Digital National ID (national-id.gov.ph) as a valid primary proof of identity.",
    severity: "warning",
    relatedModule: "serbisyo",
    regionCode: "NATIONAL",
    sourceName: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://philsys.gov.ph",
    verificationStatus: "officially_verified",
    startsAt: "2026-10-15",
    expiresAt: "2027-12-31",
    isActive: true,
  },
  {
    id: "ann-scam-alert",
    title: "Public Advisory Against Unsolicited SMS & Messaging App Job Offers Asking for Fees",
    summary:
      "DOLE, DMW, and CICC warn the public never to pay 'processing', 'task unlocking', or 'medical reservation' fees for online or overseas job offers. Report suspected scams via Trabaho Scam Report or Hotline 1326.",
    severity: "emergency",
    relatedModule: "kaligtasan",
    regionCode: "NATIONAL",
    sourceName: "Cybercrime Investigation and Coordinating Center (CICC)",
    sourceUrl: "https://cicc.gov.ph",
    verificationStatus: "officially_verified",
    startsAt: "2026-11-01",
    expiresAt: "2027-06-30",
    isActive: true,
  },
];

export const INITIAL_REPORTS: ReportSubmission[] = [
  {
    id: "rep-1001",
    targetType: "resource",
    targetId: "res-psa-birth-cert",
    targetTitle: "PSA Birth Certificate Request Guide",
    reason: "outdated_info",
    details: "Verified that PSA CRS East Avenue outlet requires online appointment booking via crs-appointment.psahelpline.ph before walk-in.",
    officialReferenceUrl: "https://psa.gov.ph",
    resolutionStatus: "resolved",
    resolutionNotes: "Checklist item #1 updated and verified against official PSA CRS advisory.",
    createdAt: "2026-11-02",
  },
  {
    id: "rep-1002",
    targetType: "opportunity",
    targetId: "opp-job-philjobnet-customer-it",
    targetTitle: "Suspicious Telegram Task Recruiter Impersonating DOLE",
    reason: "suspected_scam",
    details: "Reported an unverified Telegram channel using DOLE logos and asking applicants for PHP 1,500 GCash deposit.",
    officialReferenceUrl: "https://philjobnet.gov.ph",
    resolutionStatus: "investigating",
    resolutionNotes: "Forwarded to PNP-ACG / CICC 1326 reference log; added public scam warning banner.",
    createdAt: "2026-11-08",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud-1",
    actorName: "GabayPH Content Verification Team",
    actorRole: "content_admin",
    action: "resource.verify",
    entityType: "resource",
    entityId: "res-psa-birth-cert",
    summary: "Verified PSA CRS appointment requirements and RA 11261 fee exemption against psa.gov.ph.",
    createdAt: "2026-11-01 09:15 PST",
  },
  {
    id: "aud-2",
    actorName: "GabayPH Security & Trust Admin",
    actorRole: "super_admin",
    action: "announcement.publish",
    entityType: "announcement",
    entityId: "ann-scam-alert",
    summary: "Published CICC 1326 & DOLE anti-job-scam advisory with automatic expiration date.",
    createdAt: "2026-11-01 10:30 PST",
  },
  {
    id: "aud-3",
    actorName: "NCR Regional Moderator",
    actorRole: "regional_moderator",
    action: "bayanihan.approve",
    entityType: "bayanihan_post",
    entityId: "bay-2",
    summary: "Verified DSWD NROC Pasay volunteer shift schedule and official DRMB hotline.",
    createdAt: "2026-11-03 14:20 PST",
  },
];

export function buildUniversalSearchIndex(): UniversalSearchResult[] {
  const results: UniversalSearchResult[] = [];

  for (const res of VERIFIED_RESOURCES) {
    results.push({
      id: res.id,
      slug: res.slug,
      title: res.title,
      summary: res.summary,
      module: res.module,
      recordKind: "resource",
      href: `/${res.module}?item=${encodeURIComponent(res.slug)}`,
      regionCode: res.regionCode,
      regionName: res.regionName,
      sourceName: res.sourceName,
      sourceUrl: res.sourceUrl,
      verificationStatus: res.verificationStatus,
      lastVerifiedAt: res.lastVerifiedAt,
      badgeLabel: res.categoryName,
    });
  }

  for (const opp of VERIFIED_OPPORTUNITIES) {
    const targetModule = opp.type === "scholarship" ? "aral" : "trabaho";
    results.push({
      id: opp.id,
      slug: opp.slug,
      title: opp.title,
      summary: `${opp.description} (${opp.compensationOrBenefit})`,
      module: targetModule,
      recordKind: "opportunity",
      href: `/${targetModule}?item=${encodeURIComponent(opp.slug)}`,
      regionCode: opp.regionCode,
      regionName: opp.regionName,
      sourceName: opp.sourceName,
      sourceUrl: opp.sourceUrl,
      verificationStatus: opp.verificationStatus,
      lastVerifiedAt: opp.lastVerifiedAt,
      badgeLabel:
        opp.type === "job"
          ? "Verified Job"
          : opp.type === "scholarship"
          ? "Scholarship Grant"
          : "Free Skills Training",
    });
  }

  for (const prog of VERIFIED_ASSISTANCE_PROGRAMS) {
    results.push({
      id: prog.id,
      slug: prog.slug,
      title: prog.programName,
      summary: `${prog.description} — Benefit: ${prog.benefitSummary}`,
      module: "pera",
      recordKind: "assistance_program",
      href: `/pera?item=${encodeURIComponent(prog.slug)}`,
      regionCode: prog.regionCode,
      regionName: prog.regionName,
      sourceName: prog.sourceName,
      sourceUrl: prog.sourceUrl,
      verificationStatus: prog.verificationStatus,
      lastVerifiedAt: prog.lastVerifiedAt,
      badgeLabel: "Financial & Medical Assistance",
    });
  }

  for (const post of VERIFIED_BAYANIHAN_POSTS) {
    results.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      module: "bayanihan",
      recordKind: "bayanihan",
      href: `/bayanihan?item=${encodeURIComponent(post.slug)}`,
      regionCode: post.regionCode,
      regionName: post.regionName,
      sourceName: post.sourceName,
      sourceUrl: post.sourceUrl,
      verificationStatus: post.verificationStatus,
      lastVerifiedAt: post.lastVerifiedAt,
      badgeLabel:
        post.postType === "volunteer_call"
          ? "Volunteer Opportunity"
          : post.postType === "donation_offer"
          ? "Relief & Donation Hub"
          : "Community Assistance",
    });
  }

  for (const hot of VERIFIED_EMERGENCY_HOTLINES) {
    results.push({
      id: hot.id,
      slug: hot.acronym.toLowerCase().replace(/\s+/g, "-"),
      title: `${hot.agencyName} — Hotline ${hot.primaryNumber}`,
      summary: `${hot.coverage} (${hot.operatingHours}). Secondary numbers: ${hot.secondaryNumbers.join(", ") || "N/A"}.`,
      module: "kaligtasan",
      recordKind: "hotline",
      href: `/kaligtasan#hotlines`,
      regionCode: "NATIONAL",
      regionName: "Nationwide (All Regions)",
      sourceName: hot.agencyName,
      sourceUrl: hot.sourceUrl,
      verificationStatus: hot.verificationStatus,
      lastVerifiedAt: hot.lastVerifiedAt,
      badgeLabel: `Emergency Hotline: ${hot.primaryNumber}`,
    });
  }

  return results;
}

export function queryUniversalSearch(params: {
  q?: string;
  module?: string;
  region?: string;
  verification?: string;
}): UniversalSearchResult[] {
  const all = buildUniversalSearchIndex();
  const normalizedQ = (params.q || "").trim().toLowerCase();
  const mod = params.module && params.module !== "all" ? params.module : null;
  const reg = params.region && params.region !== "ALL" ? params.region : null;
  const ver =
    params.verification && params.verification !== "all"
      ? params.verification
      : null;

  return all.filter((item) => {
    if (mod && item.module !== mod) {
      return false;
    }
    if (reg && item.regionCode !== reg && item.regionCode !== "NATIONAL") {
      return false;
    }
    if (ver && item.verificationStatus !== ver) {
      return false;
    }
    if (!normalizedQ) {
      return true;
    }

    const haystack = [
      item.title,
      item.summary,
      item.sourceName,
      item.badgeLabel,
      item.regionName,
      item.module,
    ]
      .join(" ")
      .toLowerCase();

    const terms = normalizedQ
      .replace(/[?,!.;:()[\]"']/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    if (terms.length === 0) return false;
    return terms.every((term) => haystack.includes(term));
  });
}
