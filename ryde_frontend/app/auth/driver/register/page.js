"use client"

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone, FileText, Car, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../../../../components/ui/buttons";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import AuthLayout from "../../../../components/auth/AuthLayout";
import Modal from "../../../../components/ui/popup";
import { useDispatch, useSelector } from "react-redux";
import { driverRegister } from "../../../../lib/features/AuthSlice";
import { useRouter } from "next/navigation";

export default function DriverRegister() {

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);

  // const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);

  // if (isLoggedIn) {
  //   if (user.role == "user") {
  //     router.push("/profile");
  //   }
  //   if (user.role == "driver") {
  //     router.push("/driver-dashboard");
  //   }
  // }

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    vehicle: {
      color: "",
      capacity: 0,
      plate: "",
      vehicleType: "",
      vehicleModel: "",
    },
    driverLicenseExpiryDate: "",
    carInsuranceExpiryDate: "",
    driverLicense: null,
    carInsurance: null,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.vehicle) {
      // Updating nested vehicle object
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [name]: value,
        },
      }));
    } else {
      // Updating top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // check all the fields on step one are filled before proceeding
    if (!formData.fullname || !formData.email || !formData.phoneNo || !formData.password || !formData.confirmPassword || !formData.driverLicenseExpiryDate || !formData.carInsuranceExpiryDate) {
      alert("Please fill all the fields before proceeding.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must accept the terms and conditions to register.");
      return;
    }

    try {

      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNo", formData.phoneNo);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("driverLicenseExpiryDate", formData.driverLicenseExpiryDate);
      formDataToSend.append("carInsuranceExpiryDate", formData.carInsuranceExpiryDate);
      formDataToSend.append("vehicle[vehicleModel]", formData.vehicle.vehicleModel);
      formDataToSend.append("vehicle[color]", formData.vehicle.color);
      formDataToSend.append("vehicle[plate]", formData.vehicle.plate);
      formDataToSend.append("vehicle[capacity]", formData.vehicle.capacity);
      formDataToSend.append("vehicle[vehicleType]", formData.vehicle.vehicleType);

      if (!formData.driverLicense || !formData.carInsurance) {
        alert("Please upload both the driver's license and proof of insurance.");
        return;
      }
      formDataToSend.append("carInsurance", formData.carInsurance);
      formDataToSend.append("driverLicense", formData.driverLicense);


      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }


      const result = await dispatch(driverRegister(formDataToSend)).unwrap();

      // return;
      // console.log("Driver Registered:", result);
      // console.log("form data" , formDataToSend);
      router.push("/verify-email"); // Redirect to dashboard after successful registration

    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Become a Driver" subtitle="Sign up to start earning with Ryde5">
      {step === 1 && (
        <div className="space-y-4">
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />

          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />


          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input id="phoneNo" name="phoneNo" type="tel" value={formData.phoneNo} onChange={handleChange} required />
          {/* driverLicenseExpiryDate */}
          <Label htmlFor="driverLicenseExpiryDate">Driver's License Expiry Date</Label>
          <Input id="driverLicenseExpiryDate" name="driverLicenseExpiryDate" type="date" value={formData.driverLicenseExpiryDate} onChange={handleChange} required />

          <Label htmlFor="carInsuranceExpiryDate">Car Insurance Expiry Date</Label>
          <Input id="carInsuranceExpiryDate" name="carInsuranceExpiryDate" type="date" value={formData.carInsuranceExpiryDate} onChange={handleChange} required />

          {/* <Label htmlFor="vehicleMake">Vehicle Make</Label>
          <Input id="vehicleMake" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} required /> */}


          <Button onClick={handleNext} className="bg-orange-500 ml-auto text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
          >
            Next <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="vehicleModel">Vehicle Model</Label>
          <Input id="vehicleModel" name="vehicleModel" value={formData.vehicle.vehicleModel} onChange={handleChange} required />

          <Label htmlFor="vehicleColor">Vehicle Color</Label>
          <Input id="vehicleColor" name="color" value={formData.vehicle.color} onChange={handleChange} required />

          <Label htmlFor="vehiclePlate">Vehicle Plate Number</Label>
          <Input id="vehiclePlate" name="plate" value={formData.vehicle.plate} onChange={handleChange} required />

          <Label htmlFor="vehicleCapacity">Vehicle Capacity</Label>
          <Input id="vehicleCapacity" name="capacity" type="number" value={formData.vehicle.capacity} onChange={handleChange} required />

          <select id="vehicleType" name="vehicleType" value={formData.vehicle.vehicleType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="auto">Auto</option>
          </select>


          <Label htmlFor="carInsurance">Proof of Insurance</Label>
          <Input id="carInsurance" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "carInsurance")} required />

          <Label htmlFor="driverLicense">Upload Driver's License</Label>
          <Input id="driverLicense" type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "driverLicense")} required />

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="terms" className="text-sm">
              I have read and accept the
              <button type="button" className="text-orange-600 hover:underline ml-1" onClick={() => setShowTerms(true)}>
                Terms and Conditions
              </button>
            </label>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline">
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
      )}

      {showTerms && (
        <Modal title="Terms and Conditions" onClose={() => setShowTerms(false)}>
          <p>[Insert detailed terms and conditions here.]</p>
          <Button onClick={() => setShowTerms(false)} className="mt-4">Close</Button>
        </Modal>
      )}
    </AuthLayout>
  );
}
