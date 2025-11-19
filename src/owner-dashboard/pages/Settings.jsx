import React from "react";
import {
  RxRocket,
  RxPerson,
  RxHome,
  RxBell,
  RxGear,
  RxTriangleRight,
  RxChevronDown,
  RxCopy,
  RxClock,
} from "react-icons/rx";
import { HiEye } from "react-icons/hi2";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { FaQrcode, FaPrint, FaInfoCircle, FaDownload } from "react-icons/fa";
import { authAPI, restaurantAPI } from "../../services/api";

const MENU_PREVIEW_URL = "/menu-preview";

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: RxPerson },
  { id: "restaurant", label: "Restaurant", icon: RxHome },
  { id: "hours", label: "Operating Hours", icon: RxClock },
  { id: "notifications", label: "Notifications", icon: RxBell },
  { id: "orders", label: "Order Settings", icon: RxGear },
  { id: "qr", label: "Restaurant QR Code", icon: FaQrcode },
];

const InputField = ({ label, required, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition",
        "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  </div>
);

const PlaceholderPanel = ({ title }) => (
  <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-sm text-slate-500">
    {title} configuration will be available once backend integration is ready.
  </section>
);

const UploadZone = ({ label, required, helperText, error }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {error && <span className="text-xs font-semibold text-rose-500">{error}</span>}
    </div>
    <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
          <HiOutlineCloudUpload className="size-6 text-emerald-500" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          Preferred size is 400px × 300px
        </p>
        <p className="text-xs text-slate-500">
          {helperText ?? "Drag 'n' drop some files here, or click to select files"}
        </p>
      </div>
    </div>
  </div>
);

const ToggleSwitch = ({ label, helperText, checked, onChange }) => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
    <button
      type="button"
      onClick={onChange}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        checked ? "bg-emerald-500" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block size-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  </div>
);

const InlineToggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        checked ? "bg-emerald-500" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block size-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  </div>
);

export function SettingsPage({ initialTab = "profile" }) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  // Profile state
  const [profileData, setProfileData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePictureUrl: null,
  });

  // Restaurant state
  const [restaurantForm, setRestaurantForm] = React.useState({
    restaurantName: "",
    address: "",
    email: "",
    phone: "",
    tagline: "",
    description: "",
    aboutTitle: "",
    aboutBody: "",
    aboutImageUrl: null,
    logoUrl: null,
    heroImageUrl: null,
    whyChooseUsTitle: "",
    whyChooseUsBody: "",
    whyChooseUsImageUrl: null,
    languages: ["English"],
    defaultLanguage: "English",
    currency: "LKR",
    defaultFoodImage: true,
  });

  const [orderSettings, setOrderSettings] = React.useState({
    enableTip: true,
    enableCancelOrder: false,
    invoicePrefix: "INVOICE",
    enableInvoiceNotes: true,
    enableScheduledOrders: false,
  });

  const [qrAccordion, setQrAccordion] = React.useState({
    logo: true,
    pattern: false,
    eyes: false,
    colors: false,
    frame: false,
  });

  const [operatingHours, setOperatingHours] = React.useState([
    { day: "Monday", time: "09:00 - 17:00", isOpen: true },
    { day: "Tuesday", time: "09:00 - 17:00", isOpen: true },
    { day: "Wednesday", time: "09:00 - 17:00", isOpen: true },
    { day: "Thursday", time: "09:00 - 17:00", isOpen: true },
    { day: "Friday", time: "09:00 - 17:00", isOpen: true },
    { day: "Saturday", time: "09:00 - 17:00", isOpen: true },
    { day: "Sunday", time: "Closed", isOpen: false },
  ]);

  // Load data on mount
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      // Load user profile
      const user = await authAPI.getCurrentUser();
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePictureUrl: user.profilePictureUrl || null,
      });

      // Load restaurant data
      const restaurant = await restaurantAPI.getRestaurant();
      if (restaurant) {

        setRestaurantForm({
          restaurantName: restaurant.name || "",
          address: restaurant.address || "",
          email: restaurant.contactEmail || "",
          phone: restaurant.contactPhone || "",
          tagline: restaurant.tagline || "",
          description: restaurant.description || "",
          aboutTitle: restaurant.aboutTitle || "",
          aboutBody: restaurant.aboutBody || "",
          aboutImageUrl: restaurant.aboutImageUrl || null,
          logoUrl: restaurant.logoUrl || null,
          heroImageUrl: restaurant.heroImageUrl || null,
          whyChooseUsTitle: restaurant.whyChooseUsTitle || "",
          whyChooseUsBody: restaurant.whyChooseUsBody || "",
          whyChooseUsImageUrl: restaurant.whyChooseUsImageUrl || null,
          languages: restaurant.settings?.languages || ["English"],
          defaultLanguage: restaurant.settings?.defaultLanguage || "English",
          currency: restaurant.settings?.currency || "LKR",
          defaultFoodImage: restaurant.settings?.defaultFoodImage ?? true,
        });

        // Load order settings
        if (restaurant.settings?.orderSettings) {
          setOrderSettings({
            enableTip: restaurant.settings.orderSettings.enableTip ?? true,
            enableCancelOrder: restaurant.settings.orderSettings.enableCancelOrder ?? false,
            invoicePrefix: restaurant.settings.orderSettings.invoicePrefix || "INVOICE",
            enableInvoiceNotes: restaurant.settings.orderSettings.enableInvoiceNotes ?? true,
            enableScheduledOrders: restaurant.settings.orderSettings.enableScheduledOrders ?? false,
          });
        }

        // Load operating hours
        if (restaurant.operatingHours && restaurant.operatingHours.length > 0) {
          setOperatingHours(restaurant.operatingHours.map(oh => ({
            day: oh.day,
            time: oh.time,
            isOpen: oh.isOpen,
          })));
        }
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message || "Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  const toggleQrSection = (section) => {
    setQrAccordion((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setError("");
    try {
      await authAPI.updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone || null,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      alert(`Failed to update profile: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;
    
    setSaving(true);
    setError("");
    try {
      const result = await authAPI.uploadProfilePicture(file);
      // Update profile with new profile picture URL
      setProfileData(prev => ({ ...prev, profilePictureUrl: result.imageUrl }));
      alert("Profile picture uploaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to upload logo");
      alert(`Failed to upload logo: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRestaurantSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Update restaurant info
      await restaurantAPI.updateRestaurant({
        name: restaurantForm.restaurantName,
        tagline: restaurantForm.tagline || null,
        description: restaurantForm.description || null,
        address: restaurantForm.address,
        contactEmail: restaurantForm.email,
        contactPhone: restaurantForm.phone || null,
        aboutTitle: restaurantForm.aboutTitle || null,
        aboutBody: restaurantForm.aboutBody || null,
        whyChooseUsTitle: restaurantForm.whyChooseUsTitle || null,
        whyChooseUsBody: restaurantForm.whyChooseUsBody || null,
        whyChooseUsImageUrl: restaurantForm.whyChooseUsImageUrl || null,
      });

      // Update restaurant settings
      await restaurantAPI.updateRestaurantSettings({
        currency: restaurantForm.currency,
        defaultLanguage: restaurantForm.defaultLanguage,
        languages: restaurantForm.languages,
        defaultFoodImage: restaurantForm.defaultFoodImage,
        orderSettings: orderSettings,
      });

      alert("Restaurant information updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update restaurant");
      alert(`Failed to update restaurant: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRestaurantLogoUpload = async (file) => {
    if (!file) return;
    
    setSaving(true);
    setError("");
    try {
      const result = await restaurantAPI.uploadLogo(file);
      setRestaurantForm(prev => ({ ...prev, logoUrl: result.imageUrl }));
      alert("Logo uploaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to upload logo");
      alert(`Failed to upload logo: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCoverImageUpload = async (file) => {
    if (!file) return;
    
    setSaving(true);
    setError("");
    try {
      const result = await restaurantAPI.uploadCoverImage(file);
      setRestaurantForm(prev => ({ ...prev, heroImageUrl: result.imageUrl }));
      alert("Cover image uploaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to upload cover image");
      alert(`Failed to upload cover image: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAboutImageUpload = async (file) => {
    if (!file) return;
    
    setSaving(true);
    setError("");
    try {
      const result = await restaurantAPI.uploadAboutImage(file);
      setRestaurantForm(prev => ({ ...prev, aboutImageUrl: result.imageUrl }));
      alert("About image uploaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to upload image");
      alert(`Failed to upload image: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleWhyChooseUsImageUpload = async (file) => {
    if (!file) return;
    
    setSaving(true);
    setError("");
    try {
      const result = await restaurantAPI.uploadWhyChooseUsImage(file);
      setRestaurantForm(prev => ({ ...prev, whyChooseUsImageUrl: result.imageUrl }));
      alert("Why Choose Us image uploaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to upload image");
      alert(`Failed to upload image: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleOperatingHoursSave = async () => {
    setSaving(true);
    setError("");
    try {
      await restaurantAPI.updateOperatingHours(operatingHours);
      alert("Operating hours updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update operating hours");
      alert(`Failed to update operating hours: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleOrderSettingsSave = async () => {
    setSaving(true);
    setError("");
    try {
      await restaurantAPI.updateRestaurantSettings({
        currency: restaurantForm.currency,
        defaultLanguage: restaurantForm.defaultLanguage,
        languages: restaurantForm.languages,
        defaultFoodImage: restaurantForm.defaultFoodImage,
        orderSettings: orderSettings,
      });
      alert("Order settings updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update order settings");
      alert(`Failed to update order settings: ${err.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "profile") {
      if (loading) {
        return (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
            <p className="text-sm text-slate-500">Loading profile data...</p>
          </section>
        );
      }

      return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Profile Settings
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                General information
              </h3>
              <p className="text-sm text-slate-500">
                Update your restaurant owner details to keep things consistent
                across the platform.
              </p>
            </div>
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-10 px-6 py-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Profile Picture
              </label>
              <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
                {profileData.profilePictureUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={profileData.profilePictureUrl.startsWith('http') ? profileData.profilePictureUrl : `http://localhost:5000${profileData.profilePictureUrl}`}
                      alt="Profile Picture"
                      className="h-32 w-32 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProfilePictureUpload(file);
                      }}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Change Profile Picture
                    </label>
                  </div>
                ) : (
                  <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <HiOutlineCloudUpload className="size-7 text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Preferred size is 400px × 400px
                    </p>
                    <p className="text-xs text-slate-500">
                      Drag &apos;n&apos; drop some files here, or click to select files
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProfilePictureUpload(file);
                      }}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Upload Profile Picture
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="First name"
                required
                placeholder="First name"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
              <InputField
                label="Last name"
                required
                placeholder="Last name"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
              <InputField
                label="Email"
                required
                type="email"
                placeholder="name@email.com"
                value={profileData.email}
                disabled
                className="bg-slate-50"
              />
              <InputField
                label="Phone"
                placeholder="+94 71 000 0000"
                value={profileData.phone || ""}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
        </section>
      );
    }

    if (activeTab === "restaurant") {
      if (loading) {
        return (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
            <p className="text-sm text-slate-500">Loading restaurant data...</p>
          </section>
        );
      }

      return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Restaurant Settings
              </p>
              <h3 className="text-lg font-semibold text-slate-900">Brand information</h3>
              <p className="text-sm text-slate-500">
                Upload your latest branding assets and update restaurant level preferences.
              </p>
            </div>
              <button
                type="button"
                onClick={handleRestaurantSave}
                disabled={saving}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-10 px-6 py-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  Logo
                </label>
                <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
                  {restaurantForm.logoUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={restaurantForm.logoUrl.startsWith('http') ? restaurantForm.logoUrl : `http://localhost:5000${restaurantForm.logoUrl}`}
                        alt="Logo"
                        className="h-32 w-32 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleRestaurantLogoUpload(file);
                        }}
                        className="hidden"
                        id="restaurant-logo-upload"
                      />
                      <label
                        htmlFor="restaurant-logo-upload"
                        className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Change Logo
                      </label>
                    </div>
                  ) : (
                    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                        <HiOutlineCloudUpload className="size-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        Preferred size is 400px × 300px
                      </p>
                      <p className="text-xs text-slate-500">
                        Drag &apos;n&apos; drop some files here, or click to select files
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleRestaurantLogoUpload(file);
                        }}
                        className="hidden"
                        id="restaurant-logo-upload"
                      />
                      <label
                        htmlFor="restaurant-logo-upload"
                        className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Upload Logo
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  Cover image
                </label>
                <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
                  {restaurantForm.heroImageUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={restaurantForm.heroImageUrl.startsWith('http') ? restaurantForm.heroImageUrl : `http://localhost:5000${restaurantForm.heroImageUrl}`}
                        alt="Cover"
                        className="h-32 w-full rounded-xl object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverImageUpload(file);
                        }}
                        className="hidden"
                        id="cover-image-upload"
                      />
                      <label
                        htmlFor="cover-image-upload"
                        className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Change Cover Image
                      </label>
                    </div>
                  ) : (
                    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                        <HiOutlineCloudUpload className="size-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        Preferred size is 1200px × 600px
                      </p>
                      <p className="text-xs text-slate-500">
                        Drag &apos;n&apos; drop some files here, or click to select files
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverImageUpload(file);
                        }}
                        className="hidden"
                        id="cover-image-upload"
                      />
                      <label
                        htmlFor="cover-image-upload"
                        className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Upload Cover Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Restaurant name"
                required
                placeholder="Restaurant name"
                value={restaurantForm.restaurantName}
                onChange={(event) =>
                  setRestaurantForm((prev) => ({ ...prev, restaurantName: event.target.value }))
                }
              />
              <InputField
                label="Tagline"
                placeholder="Your restaurant tagline"
                value={restaurantForm.tagline || ""}
                onChange={(event) =>
                  setRestaurantForm((prev) => ({ ...prev, tagline: event.target.value }))
                }
              />
              <InputField
                label="Email address"
                required
                type="email"
                placeholder="restaurant@email.com"
                value={restaurantForm.email}
                onChange={(event) =>
                  setRestaurantForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <InputField
                label="Contact number"
                placeholder="+94 71 000 0000"
                value={restaurantForm.phone || ""}
                onChange={(event) =>
                  setRestaurantForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  required
                  placeholder="Street, City, Country"
                  value={restaurantForm.address}
                  onChange={(event) =>
                    setRestaurantForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Restaurant description"
                    value={restaurantForm.description || ""}
                    onChange={(event) =>
                      setRestaurantForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="About Title"
                  placeholder="About section title"
                  value={restaurantForm.aboutTitle || ""}
                  onChange={(event) =>
                    setRestaurantForm((prev) => ({ ...prev, aboutTitle: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    About Body
                  </label>
                  <textarea
                    placeholder="About section description"
                    value={restaurantForm.aboutBody || ""}
                    onChange={(event) =>
                      setRestaurantForm((prev) => ({ ...prev, aboutBody: event.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">
                    About Image
                  </label>
                  <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center">
                    {restaurantForm.aboutImageUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={restaurantForm.aboutImageUrl.startsWith('http') ? restaurantForm.aboutImageUrl : `http://localhost:5000${restaurantForm.aboutImageUrl}`}
                          alt="About Image"
                          className="h-48 w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAboutImageUpload(file);
                          }}
                          className="hidden"
                          id="about-image-upload"
                        />
                        <label
                          htmlFor="about-image-upload"
                          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Change About Image
                        </label>
                      </div>
                    ) : (
                      <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                          <HiOutlineCloudUpload className="size-6 text-emerald-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          Preferred size is 900px × 600px
                        </p>
                        <p className="text-xs text-slate-500">
                          Drag &apos;n&apos; drop some files here, or click to select files
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAboutImageUpload(file);
                          }}
                          className="hidden"
                          id="about-image-upload"
                        />
                        <label
                          htmlFor="about-image-upload"
                          className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Upload About Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Why Choose Us Title"
                  placeholder="Why choose us section title"
                  value={restaurantForm.whyChooseUsTitle || ""}
                  onChange={(event) =>
                    setRestaurantForm((prev) => ({ ...prev, whyChooseUsTitle: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Why Choose Us Body
                  </label>
                  <textarea
                    placeholder="Why choose us section description"
                    value={restaurantForm.whyChooseUsBody || ""}
                    onChange={(event) =>
                      setRestaurantForm((prev) => ({ ...prev, whyChooseUsBody: event.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Why Choose Us Image
              </label>
              <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
                {restaurantForm.whyChooseUsImageUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={restaurantForm.whyChooseUsImageUrl.startsWith('http') ? restaurantForm.whyChooseUsImageUrl : `http://localhost:5000${restaurantForm.whyChooseUsImageUrl}`}
                      alt="Why Choose Us"
                      className="h-32 w-full rounded-xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWhyChooseUsImageUpload(file);
                      }}
                      className="hidden"
                      id="why-choose-us-image-upload"
                    />
                    <label
                      htmlFor="why-choose-us-image-upload"
                      className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <HiOutlineCloudUpload className="size-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Preferred size is 1200px × 600px
                    </p>
                    <p className="text-xs text-slate-500">
                      Drag &apos;n&apos; drop some files here, or click to select files
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWhyChooseUsImageUpload(file);
                      }}
                      className="hidden"
                      id="why-choose-us-image-upload"
                    />
                    <label
                      htmlFor="why-choose-us-image-upload"
                      className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Upload Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Languages
                </label>
                <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                  {restaurantForm.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {lang}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    + Add language
                  </button>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Default language
                  </label>
                  <select
                    value={restaurantForm.defaultLanguage}
                    onChange={(event) =>
                      setRestaurantForm((prev) => ({ ...prev, defaultLanguage: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Currency</label>
                  <select
                    value={restaurantForm.currency}
                    onChange={(event) =>
                      setRestaurantForm((prev) => ({ ...prev, currency: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="LKR">Sri Lankan Rupee (Rs)</option>
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <ToggleSwitch
              label="Enable default food image"
              helperText="Use a fallback image when a menu item doesn’t have its own photo."
              checked={restaurantForm.defaultFoodImage}
              onChange={() =>
                setRestaurantForm((prev) => ({
                  ...prev,
                  defaultFoodImage: !prev.defaultFoodImage,
                }))
              }
            />
          </div>
        </section>
      );
    }

    if (activeTab === "hours") {
      if (loading) {
        return (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
            <p className="text-sm text-slate-500">Loading operating hours...</p>
          </section>
        );
      }

      return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Operating Hours
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                Restaurant Opening Hours
              </h3>
              <p className="text-sm text-slate-500">
                Set your restaurant opening hours for each day of the week.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOperatingHoursSave}
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-4 px-6 py-8">
            {operatingHours.map((hour, index) => (
              <div
                key={hour.day}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="w-32">
                  <p className="text-sm font-semibold text-slate-800">{hour.day}</p>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="09:00 - 17:00"
                    value={hour.time}
                    onChange={(e) => {
                      const newHours = [...operatingHours];
                      newHours[index].time = e.target.value;
                      setOperatingHours(newHours);
                    }}
                    disabled={!hour.isOpen}
                    className={[
                      "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm transition",
                      "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
                      !hour.isOpen && "bg-slate-50 text-slate-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newHours = [...operatingHours];
                      newHours[index].isOpen = !newHours[index].isOpen;
                      if (!newHours[index].isOpen) {
                        newHours[index].time = "Closed";
                      }
                      setOperatingHours(newHours);
                    }}
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      hour.isOpen ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block size-5 transform rounded-full bg-white transition",
                        hour.isOpen ? "translate-x-5" : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                  <span className="text-xs font-semibold text-slate-600">
                    {hour.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "notifications") {
      return (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Notification settings
              </span>
            </div>
            <button
              type="button"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save
            </button>
          </div>

          {[
            { id: "orders", title: "Order notification sound", sound: "Default Sound" },
            { id: "feedback", title: "Feedback notification sound", sound: "Sound 1" },
            { id: "hotActions", title: "Hot-action notification sound", sound: "Sound 2" },
          ].map(({ id, title, sound }) => (
            <div
              key={id}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm"
            >
              <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
              <InlineToggle label="Enable" checked onChange={() => {}} />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Sound <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <select className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                    <option>{sound}</option>
                    <option>Sound 1</option>
                    <option>Sound 2</option>
                    <option>Sound 3</option>
                  </select>
                  <button
                    type="button"
                    title="Preview sound"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 p-3 text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <RxTriangleRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      );
    }

    if (activeTab === "orders") {
      if (loading) {
        return (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
            <p className="text-sm text-slate-500">Loading order settings...</p>
          </section>
        );
      }

      return (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Order Settings
              </span>
            </div>
            <button
              type="button"
              onClick={handleOrderSettingsSave}
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customers
              </p>
              <div className="mt-4 space-y-3">
                <InlineToggle
                  label="Enable customer tip"
                  checked={orderSettings.enableTip}
                  onChange={() =>
                    setOrderSettings((prev) => ({ ...prev, enableTip: !prev.enableTip }))
                  }
                />
                <InlineToggle
                  label="Enable cancel order"
                  checked={orderSettings.enableCancelOrder}
                  onChange={() =>
                    setOrderSettings((prev) => ({
                      ...prev,
                      enableCancelOrder: !prev.enableCancelOrder,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Invoice
              </p>
              <div className="grid gap-4 md:grid-cols-[minmax(0,200px)_1fr]">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    Invoice ID Prefix <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orderSettings.invoicePrefix}
                    onChange={(event) =>
                      setOrderSettings((prev) => ({ ...prev, invoicePrefix: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <InlineToggle
                  label="Enable invoice notes"
                  checked={orderSettings.enableInvoiceNotes}
                  onChange={() =>
                    setOrderSettings((prev) => ({
                      ...prev,
                      enableInvoiceNotes: !prev.enableInvoiceNotes,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Operations
              </p>
              <InlineToggle
                label="Enable scheduled orders"
                checked={orderSettings.enableScheduledOrders}
                onChange={() =>
                  setOrderSettings((prev) => ({
                    ...prev,
                    enableScheduledOrders: !prev.enableScheduledOrders,
                  }))
                }
              />
            </div>
          </section>
        </section>
      );
    }

    if (activeTab === "qr") {
      const QR_SECTIONS = [
        {
          id: "logo",
          title: "Logo",
          description: "Add your restaurant logo to the QR center.",
        },
        {
          id: "pattern",
          title: "Pattern",
          description: "Choose the pattern style that reflects your branding.",
        },
        { id: "eyes", title: "Eyes", description: "Customize the corner eyes." },
        {
          id: "colors",
          title: "Colors",
          description: "Adjust primary and secondary colors.",
        },
        { id: "frame", title: "Frame", description: "Select a frame to display." },
      ];

      return (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Customize QR code
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
              >
                <FaInfoCircle className="size-4" />
                Customize your QR code for Restaurant
              </button>
            </div>
            <button
              type="button"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
              {QR_SECTIONS.map(({ id, title, description }) => {
                const isOpen = qrAccordion[id];
                return (
                  <div key={id} className="rounded-2xl border border-slate-100 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => toggleQrSection(id)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left font-semibold text-slate-800"
                    >
                      <span className="inline-flex items-center gap-2">
                        {title}
                      </span>
                      <RxChevronDown
                        className={[
                          "size-5 text-slate-400 transition",
                          isOpen ? "rotate-180 text-emerald-500" : "",
                        ].join(" ")}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600">
                        {description}
                        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-500">
                          Customization controls will appear here after backend integration.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                Always scan to test that your QR works
              </div>
              <div className="flex justify-center">
                <div className="rounded-2xl border border-slate-200 bg-slate-900/5 px-6 py-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Scan%20me"
                      alt="QR preview"
                      className="mx-auto rounded-xl border border-slate-200 p-2"
                    />
                    <p className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      SCAN ME
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-emerald-500" />
                  <span>https://menutigr.com/rb-theekshana-914801602005112</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
                >
                  <RxCopy className="size-4" />
                  Copy link
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                <FaDownload className="size-4" />
                Download QR
              </button>
            </div>
          </div>
        </section>
      );
    }

    return (
      <PlaceholderPanel title="Restaurant QR code" />
    );
  };

  const handleOpenApp = () => {
    window.open(MENU_PREVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Header with title, subtitle, and action buttons */}
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
              <RxRocket className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="QR Code"
            >
              <FaQrcode className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="Print"
            >
              <FaPrint className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleOpenApp}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <HiEye className="size-5" />
              OPEN APP
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-6 pt-4">
          {SETTINGS_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={[
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-emerald-50 text-emerald-600 shadow"
                    : "text-slate-500 hover:text-emerald-600",
                ].join(" ")}
              >
                {Icon && <Icon className="size-4" />}
                {label}
              </button>
            );
          })}
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </section>
    </div>
  );
}

