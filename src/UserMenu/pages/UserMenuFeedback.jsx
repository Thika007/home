import React from "react";
import { useNavigate } from "react-router-dom";

const ToggleGroup = ({ label, value, onChange }) => (
  <div className="space-y-2 text-center">
    <p className="text-sm font-semibold text-slate-800">
      {label} <span className="text-rose-500">*</span>
    </p>
    <div className="flex justify-center gap-3">
      {["YES", "NO"].map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "w-16 rounded-lg border px-3 py-2 text-sm font-semibold transition",
              isActive
                ? "border-black bg-black text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-black",
            ].join(" ")}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

const Rating = ({ value, onChange }) => (
  <div className="space-y-2 text-center">
    <p className="text-sm font-semibold text-slate-800">
      How would you rate the value of our food?
      <br />
      <span className="text-xs font-normal text-slate-500">
        Rate from 1 star (Poor Value) to 5 stars (Great Value)
      </span>
    </p>
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl transition hover:scale-110"
        >
          {star <= value ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  </div>
);

export function UserMenuFeedbackPage() {
  const navigate = useNavigate();
  const [firstVisit, setFirstVisit] = React.useState(null);
  const [serviceFriendly, setServiceFriendly] = React.useState(null);
  const [recommend, setRecommend] = React.useState(null);
  const [rating, setRating] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <header className="flex items-center gap-3 bg-black px-4 py-3 text-sm font-semibold text-amber-300">
        <button type="button" onClick={() => navigate("/menu-preview")} className="flex items-center gap-2">
          ←
          <span className="text-white">Feedback</span>
        </button>
      </header>

      <div className="mx-auto mt-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <form className="space-y-6 text-sm">
          <div className="space-y-2">
            <label className="block font-semibold text-slate-800">
              Email address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-800">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-800">
              Please indicate our restaurant branch you would like to give feedback{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <ToggleGroup
            label="Was this your first time at the restaurant?"
            value={firstVisit}
            onChange={setFirstVisit}
          />

          <Rating value={rating} onChange={setRating} />

          <ToggleGroup
            label="Was the service friendly and welcoming?"
            value={serviceFriendly}
            onChange={setServiceFriendly}
          />

          <ToggleGroup
            label="Would you recommend us to your family and friends?"
            value={recommend}
            onChange={setRecommend}
          />

          <button
            type="button"
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

