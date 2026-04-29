# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





testing data for the test and valid cases

# symptom checker Basic Valid Cases
Symptoms: cough, fever
Duration: 3 days
Age: 25
#
Symptoms: headache, nausea
Duration: 1 day
Age: 32
#
Symptoms: sore throat, mild fever
Duration: 2 days
Age: 18
#
Symptoms: severe chest pain, sweating, nausea
Duration: 30 minutes
Age: 55
#
Symptoms: difficulty breathing, bluish lips
Duration: 10 minutes
Age: 70
#
Symptoms: unconsciousness, seizure
Duration: 5 minutes
Age: 40


risk rredictor
🧪 Basic Valid Cases
BMI: 22.5
Systolic BP: 118
Age: 25
Smoker: No
#
BMI: 24.8
Systolic BP: 122
Age: 35
Smoker: No
#
BMI: 26.1
Systolic BP: 130
Age: 40
Smoker: Yes

lab testing 
Basic Single Test Cases
Normal WBC
Test: WBC
Value: 7.5
Unit: K/uL
Ref Min: 4
Ref Max: 11
#
Low WBC
Test: WBC
Value: 3.2
Unit: K/uL
Ref Min: 4
Ref Max: 11
#
High WBC
Test: WBC
Value: 13.5
Unit: K/uL
Ref Min: 4
Ref Max: 11

Medication Interaction Checker
#  
Warfarin, Aspirin
Warfarin, Ibuprofen
Simvastatin, Clarithromycin
Lisinopril, Potassium
Viagra, Nitroglycerin
#
Paracetamol, Amoxicillin
Loratadine, Omeprazole
Vitamin C, Ibuprofen
Cetirizine, Paracetamol
Metformin, Vitamin D

Symptom Journal with AI Analysis
#
Woke up slightly tired, mild headache in the morning, felt better after coffee. Mood okay.
#
Sneezing and runny nose since morning, probably allergies. Energy is normal.
