import React from "react";
import { RxGear } from "react-icons/rx";

export function SettingsPage() {
  const [settings, setSettings] = React.useState({
    platformName: "QR Menu Platform",
    defaultCurrency: "LKR",
    defaultLanguage: "English",
    enableOwnerRegistration: true,
    enableUserRegistration: true,
    maintenanceMode: false,
  });

  React.useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("systemSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Use defaults
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">System Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Configure platform-wide settings and preferences.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Save Changes
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Platform Configuration</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">General Settings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings((prev) => ({ ...prev, platformName: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Default Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings((prev) => ({ ...prev, defaultCurrency: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="LKR">Sri Lankan Rupee (LKR)</option>
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Default Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings((prev) => ({ ...prev, defaultLanguage: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Feature Toggles</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Registration Controls</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable Owner Registration</p>
              <p className="text-xs text-slate-500">Allow new restaurant owners to register</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, enableOwnerRegistration: !prev.enableOwnerRegistration }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.enableOwnerRegistration ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block size-5 transform rounded-full bg-white transition ${
                  settings.enableOwnerRegistration ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable User Registration</p>
              <p className="text-xs text-slate-500">Allow new customers to create accounts</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, enableUserRegistration: !prev.enableUserRegistration }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.enableUserRegistration ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block size-5 transform rounded-full bg-white transition ${
                  settings.enableUserRegistration ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Temporarily disable platform access</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.maintenanceMode ? "bg-amber-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block size-5 transform rounded-full bg-white transition ${
                  settings.maintenanceMode ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

