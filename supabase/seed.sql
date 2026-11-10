-- ============================================================================
-- Seed Data: Verified Philippine Regions, Government Agencies & Public Guides
-- All URLs point to official .gov.ph or verified national institution portals.
-- ============================================================================

INSERT INTO public.locations (psgc_code, region_code, region_name, province, city_municipality, is_national)
VALUES
  ('PH-NAT', 'NATIONAL', 'Nationwide (All Regions)', NULL, NULL, TRUE),
  ('130000000', 'NCR', 'National Capital Region (Metro Manila)', 'Metro Manila', 'Manila / Quezon City', FALSE),
  ('040000000', 'Region IV-A', 'CALABARZON', 'Cavite / Laguna / Batangas / Rizal / Quezon', NULL, FALSE),
  ('030000000', 'Region III', 'Central Luzon', 'Pampanga / Bulacan / Tarlac', NULL, FALSE),
  ('070000000', 'Region VII', 'Central Visayas', 'Cebu / Bohol / Negros Oriental', 'Cebu City', FALSE),
  ('110000000', 'Region XI', 'Davao Region', 'Davao del Sur', 'Davao City', FALSE),
  ('010000000', 'Region I', 'Ilocos Region', 'Ilocos Norte / Pangasinan', NULL, FALSE),
  ('050000000', 'Region V', 'Bicol Region', 'Albay / Camarines Sur', 'Legazpi / Naga', FALSE)
ON CONFLICT (psgc_code) DO NOTHING;

INSERT INTO public.categories (module, slug, name_en, name_fil, description, display_order)
VALUES
  ('serbisyo', 'civil-registry-ids', 'Civil Registry & National IDs', 'Civil Registry at Pambansang ID', 'PSA certificates, PhilSys National ID, NBI Clearance, and passport guides.', 1),
  ('serbisyo', 'social-security-health', 'Social Security, Health & Housing', 'Seguridad Panlipunan, Kalusugan at Pabahay', 'PhilHealth, SSS, GSIS, and Pag-IBIG Fund membership and claims.', 2),
  ('trabaho', 'government-private-jobs', 'Employment & Job Portals', 'Trabaho sa Gobyerno at Pribado', 'Verified job openings from CSC, DOLE PhilJobNet, and verified employers.', 3),
  ('trabaho', 'skills-training-tesda', 'Skills Training & Certification', 'Pagsasanay at Sertipikasyon (TESDA)', 'Free technical-vocational courses and national certification.', 4),
  ('pera', 'government-assistance', 'Social & Medical Financial Aid', 'Tulong Pinansyal at Medikal', 'DSWD AICS, Malasakit Centers, PCSO, and DOLE TUPAD emergency employment.', 5),
  ('pera', 'financial-literacy', 'Financial Planning & Calculators', 'Pagpaplano ng Pera at Badyet', 'Budgeting, emergency savings, and debt management guides.', 6),
  ('bayanihan', 'community-relief-volunteer', 'Community Relief & Volunteering', 'Tulong-Komunidad at Pagboboluntaryo', 'Verified NGO drives, LGU relief operations, and community assistance.', 7),
  ('aral', 'scholarships-higher-ed', 'Scholarships & Free Education', 'Iskolarship at Libreng Edukasyon', 'CHED UniFAST, DOST-SEI scholarships, and free online learning.', 8),
  ('kaligtasan', 'emergency-disaster-response', 'Emergency Hotlines & Disaster Preparedness', 'Emergency Hotlines at Kahandaan sa Sakuna', 'National 911, NDRRMC, Philippine Red Cross 143, PAGASA, and PHIVOLCS guides.', 9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.organizations (name, acronym, slug, org_type, description, official_website, verified_email_domain, hotline, verification_status, status, last_verified_at)
VALUES
  ('Philippine Statistics Authority', 'PSA', 'psa', 'gov_agency', 'Central statistical authority of the Philippine government responsible for civil registration and the PhilSys National ID.', 'https://psa.gov.ph', 'psa.gov.ph', '(02) 8462-6600', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('National Bureau of Investigation', 'NBI', 'nbi', 'gov_agency', 'Agency under the Department of Justice issuing NBI Clearances and investigating cybercrime and fraud.', 'https://clearance.nbi.gov.ph', 'nbi.gov.ph', '(02) 8523-8231', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Philippine Health Insurance Corporation', 'PhilHealth', 'philhealth', 'gov_agency', 'Administers the National Health Insurance Program under the Universal Health Care Act.', 'https://www.philhealth.gov.ph', 'philhealth.gov.ph', '(02) 8662-2588', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Social Security System', 'SSS', 'sss', 'gov_agency', 'State-run social insurance program for workers in the private, professional, and informal sectors.', 'https://www.sss.gov.ph', 'sss.gov.ph', '1455', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Home Development Mutual Fund', 'Pag-IBIG', 'pag-ibig', 'gov_agency', 'National savings program and affordable shelter financing for Filipino workers.', 'https://www.pagibigfund.gov.ph', 'pagibigfund.gov.ph', '(02) 8724-4244', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Department of Social Welfare and Development', 'DSWD', 'dswd', 'gov_agency', 'Primary government agency mandated to develop, implement, and coordinate social protection and poverty-reduction solutions.', 'https://www.dswd.gov.ph', 'dswd.gov.ph', '(02) 8931-8101', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Department of Labor and Employment', 'DOLE', 'dole', 'gov_agency', 'National government agency mandated to formulate policies, implement programs, and serve as the policy-coordinating arm in labor and employment.', 'https://www.dole.gov.ph', 'dole.gov.ph', '1349', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Technical Education and Skills Development Authority', 'TESDA', 'tesda', 'gov_agency', 'Manages and supervises technical education and skills development in the Philippines.', 'https://www.tesda.gov.ph', 'tesda.gov.ph', '(02) 8887-7777', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Commission on Higher Education', 'CHED', 'ched', 'gov_agency', 'Governing body covering both public and private higher education institutions and UniFAST scholarships in the Philippines.', 'https://ched.gov.ph', 'ched.gov.ph', '(02) 8441-1260', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('National Disaster Risk Reduction and Management Council', 'NDRRMC', 'ndrrmc', 'gov_agency', 'Working group of government, non-government, civil sector and private sector organizations ensuring disaster protection and welfare.', 'https://ndrrmc.gov.ph', 'ocd.gov.ph', '911 / (02) 8911-5061', 'officially_verified', 'published', '2026-11-01T00:00:00Z'),
  ('Philippine Red Cross', 'PRC', 'red-cross-ph', 'ngo', 'Premier humanitarian organization in the Philippines providing blood services, disaster management, safety, and emergency medical services.', 'https://redcross.org.ph', 'redcross.org.ph', '143', 'officially_verified', 'published', '2026-11-01T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;
