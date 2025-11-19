import React from "react";
import {
  RxSun,
  RxGlobe,
  RxBell,
  RxRocket,
  RxLayers,
  RxDoubleArrowLeft,
  RxPerson,
  RxDividerHorizontal,
  RxChevronDown,
  RxHome,
} from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { restaurantAPI, authAPI } from "../../services/api";

export function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [restaurantLogo, setRestaurantLogo] = React.useState(null);
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Load restaurant logo
        const restaurant = await restaurantAPI.getRestaurant();
        if (restaurant?.logoUrl) {
          const logoUrl = restaurant.logoUrl.startsWith('http') 
            ? restaurant.logoUrl 
            : `http://localhost:5000${restaurant.logoUrl}`;
          setRestaurantLogo(logoUrl);
        }

        // Load user info and profile picture
        const user = await authAPI.getCurrentUser();
        setUserInfo(user);
        if (user?.profilePictureUrl) {
          const profileUrl = user.profilePictureUrl.startsWith('http') 
            ? user.profilePictureUrl 
            : `http://localhost:5000${user.profilePictureUrl}`;
          setProfilePicture(profileUrl);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  const handleNavigateToSettings = (section) => {
    setIsMenuOpen(false);
    navigate(`/owner-dashboard/settings?tab=${section}`);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      {restaurantLogo ? (
        <img
          src={restaurantLogo}
          alt="Restaurant logo"
          className="h-10 w-auto"
          onError={(e) => {
            e.target.src = "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg";
          }}
        />
      ) : (
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
          alt="QR Menu Platform logo"
          className="h-10 w-auto"
        />
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxSun className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxGlobe className="size-5" />
        </button>
        <button
          type="button"
          className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxBell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-rose-500 text-[10px] font-semibold leading-none text-white">
            2
          </span>
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxRocket className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxLayers className="size-5" />
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-500"
        >
          <RxDoubleArrowLeft className="size-5" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-emerald-500"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="size-9 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`flex size-9 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-white ${profilePicture ? 'hidden' : ''}`}
            >
              {userInfo ? `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`.toUpperCase() : 'BT'}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">
                {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Buddhi Thikshana'}
              </p>
              <p className="text-xs text-slate-500">Owner</p>
            </div>
            <RxChevronDown
              className={[
                "size-4 text-slate-400 transition",
                isMenuOpen ? "rotate-180 text-emerald-500" : "",
              ].join(" ")}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={() => handleNavigateToSettings("restaurant")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RxHome className="size-4 text-slate-400" />
                Restaurant Settings
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToSettings("profile")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RxPerson className="size-4 text-slate-400" />
                Profile Settings
              </button>
              <div className="my-1 h-px bg-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <RxDoubleArrowLeft className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


