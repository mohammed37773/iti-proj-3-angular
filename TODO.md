# Implement Doctor Profile Update Feature

## Steps:
- [x] Step 1: Add `updateDoctor` method to `src/app/services/doctor-service.ts`
- [x] Step 2: Update `src/app/components/pages/doctor/doctor-profile/doctor-profile.ts` (inject DoctorService, implement onSubmit)
- [x] Step 3: Test the implementation (run app, update profile, verify API call and localStorage)

## Testing:
- Ensure JSON-server is running: `json-server --watch db.json --port 3000`
- Navigate to doctor profile, edit fields, submit.
- Check network tab for PATCH request to /users/{id}
- Verify db.json updated and form reflects changes.

