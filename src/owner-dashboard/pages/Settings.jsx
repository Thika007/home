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
} from "react-icons/rx";
import { HiEye } from "react-icons/hi2";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { FaQrcode, FaPrint, FaInfoCircle, FaDownload } from "react-icons/fa";

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: RxPerson },
  { id: "restaurant", label: "Restaurant", icon: RxHome },
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

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");
  const [restaurantForm, setRestaurantForm] = React.useState({
    restaurantName: "RB Theekshana",
    address: "",
    email: "thibuddhi@gmail.com",
    phone: "",
    languages: ["English"],
    defaultLanguage: "English",
    currency: "INR",
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

  const toggleQrSection = (section) => {
    setQrAccordion((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderTabContent = () => {
    if (activeTab === "profile") {
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
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save
            </button>
          </div>

          <div className="space-y-10 px-6 py-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Logo
              </label>
              <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
                <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
                  <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm">
                    <HiOutlineCloudUpload className="size-7 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Preferred size is 400px × 300px
                  </p>
                  <p className="text-xs text-slate-500">
                    Drag &apos;n&apos; drop some files here, or click to select files
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="First name"
                required
                placeholder="Buddhi"
                defaultValue="Buddhi"
              />
              <InputField
                label="Last name"
                required
                placeholder="Thikshana"
                defaultValue="Thikshana"
              />
              <InputField
                label="Email"
                required
                type="email"
                placeholder="name@email.com"
                defaultValue="thibuddhi@gmail.com"
              />
              <InputField
                label="Phone"
                placeholder="+94 71 000 0000"
              />
            </div>
          </div>
        </section>
      );
    }

    if (activeTab === "restaurant") {
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
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Save
              </button>
          </div>

          <div className="space-y-10 px-6 py-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <UploadZone label="Logo" required />
              <UploadZone label="Cover image" required error="Cover image is required" />
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
                value={restaurantForm.phone}
                onChange={(event) =>
                  setRestaurantForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
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
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="LKR">Sri Lankan Rupee (Rs)</option>
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
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save
            </button>
          </div>

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

