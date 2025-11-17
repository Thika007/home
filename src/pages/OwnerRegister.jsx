import React, { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RxArrowLeft } from "react-icons/rx";

export function OwnerRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Owner Account Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // Step 2: Restaurant Basic Information
    restaurantName: "",
    tagline: "",
    description: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      // Check if email already exists
      const existingAccounts = JSON.parse(localStorage.getItem("ownerAccounts") || "[]");
      if (existingAccounts.some((acc) => acc.email === formData.email)) {
        newErrors.email = "This email is already registered";
      }
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    } else if (formData.restaurantName.trim().length < 3) {
      newErrors.restaurantName = "Restaurant name must be at least 3 characters";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create owner account
      const ownerAccount = {
        id: `OWNER-${Date.now()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        createdAt: new Date().toISOString(),
        role: "owner",
      };
      
      // Save owner account
      const existingAccounts = JSON.parse(localStorage.getItem("ownerAccounts") || "[]");
      existingAccounts.push(ownerAccount);
      localStorage.setItem("ownerAccounts", JSON.stringify(existingAccounts));
      
      // Create restaurant info with defaults
      const restaurantInfo = {
        name: formData.restaurantName.trim(),
        tagline: formData.tagline.trim() || "",
        description: formData.description.trim() || "",
        contactEmail: formData.contactEmail.trim(),
        aboutTitle: `About ${formData.restaurantName.trim()}`,
        aboutBody: "",
        heroImage: null,
        aboutImage: null,
        logo: null,
        hours: [
          { day: "Monday", time: "00:00 - 23:59" },
          { day: "Tuesday", time: "00:00 - 23:59" },
          { day: "Wednesday", time: "00:00 - 23:59" },
          { day: "Thursday", time: "00:00 - 23:59" },
          { day: "Friday", time: "00:00 - 23:59" },
          { day: "Saturday", time: "00:00 - 23:59" },
          { day: "Sunday", time: "00:00 - 23:59" },
        ],
      };
      
      localStorage.setItem("restaurantInfo", JSON.stringify(restaurantInfo));
      
      // Create restaurant settings with defaults
      const restaurantSettings = {
        currency: "LKR",
        defaultLanguage: "English",
        languages: ["English"],
        defaultFoodImage: true,
        orderSettings: {
          enableTip: true,
          enableCancelOrder: false,
          invoicePrefix: "INVOICE",
          enableInvoiceNotes: true,
          enableScheduledOrders: false,
        },
      };
      
      localStorage.setItem("restaurantSettings", JSON.stringify(restaurantSettings));
      
      // Initialize empty arrays
      if (!localStorage.getItem("menus")) {
        localStorage.setItem("menus", JSON.stringify([]));
      }
      if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]));
      }
      
      // Show success and redirect
      alert("Registration successful! Please log in to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section id="register" className="flex flex-1 flex-col overflow-hidden px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container flex flex-1 flex-col overflow-hidden">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold transition hover:opacity-80 md:text-base"
        >
          <RxArrowLeft className="size-4" />
          Back to home
        </button>
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-xl rounded border border-border-primary bg-background-secondary/60 p-6 shadow-lg backdrop-blur-sm md:p-10"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">Create Account</h1>
            <p className="text-md text-foreground-secondary">
              Sign up to start managing your restaurant with our platform.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition ${
                    step === currentStep
                      ? "w-8 bg-foreground-primary"
                      : step < currentStep
                      ? "w-2 bg-foreground-primary/50"
                      : "w-2 bg-foreground-primary/20"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-foreground-secondary">
              Step {currentStep} of 2
            </p>
          </div>

          <form onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={currentStep}>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="firstName" className="mb-2 block text-sm font-semibold">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange("firstName")}
                        placeholder="John"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="mb-2 block text-sm font-semibold">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange("lastName")}
                        placeholder="Doe"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder="you@example.com"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange("password")}
                        placeholder="Enter your password"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-rose-500">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                        Confirm password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange("confirmPassword")}
                        placeholder="Confirm your password"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-rose-500">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                        Phone number <span className="text-foreground-secondary">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                        placeholder="+94 71 000 0000"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={2}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="restaurantName" className="mb-2 block text-sm font-semibold">
                        Restaurant name
                      </label>
                      <input
                        id="restaurantName"
                        type="text"
                        required
                        value={formData.restaurantName}
                        onChange={handleInputChange("restaurantName")}
                        placeholder="My Restaurant"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.restaurantName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.restaurantName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="tagline" className="mb-2 block text-sm font-semibold">
                        Tagline <span className="text-foreground-secondary">(optional)</span>
                      </label>
                      <input
                        id="tagline"
                        type="text"
                        value={formData.tagline}
                        onChange={handleInputChange("tagline")}
                        placeholder="Passionate about good food"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="mb-2 block text-sm font-semibold">
                        Description <span className="text-foreground-secondary">(optional)</span>
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange("description")}
                        placeholder="Tell us about your restaurant..."
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="mb-2 block text-sm font-semibold">
                        Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleInputChange("address")}
                        placeholder="Street, City, Country"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-rose-500">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="mb-2 block text-sm font-semibold">
                        Contact email
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={handleInputChange("contactEmail")}
                        placeholder="restaurant@example.com"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-rose-500">{errors.contactEmail}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="mb-2 block text-sm font-semibold">
                        Contact phone <span className="text-foreground-secondary">(optional)</span>
                      </label>
                      <input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleInputChange("contactPhone")}
                        placeholder="+94 71 000 0000"
                        className="w-full rounded border border-border-primary bg-background-primary px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground-primary/30"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`rounded border border-border-primary px-6 py-3 text-base font-semibold transition ${
                  currentStep === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-background-primary"
                }`}
              >
                Previous
              </button>
              {currentStep === 1 ? (
                <Button
                  type="button"
                  title="Next"
                  onClick={handleNext}
                  className="flex-1 justify-center"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  title="Sign up"
                  disabled={isSubmitting}
                  className="flex-1 justify-center"
                >
                  {isSubmitting ? "Creating account..." : "Sign up"}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-foreground-secondary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold underline-offset-4 hover:underline"
              >
                Log in
              </button>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

