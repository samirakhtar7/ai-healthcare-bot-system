import React from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar({
  navItems,
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [diagnosticsOpen, setDiagnosticsOpen] = React.useState(true);
  const [patientOpen, setPatientOpen] = React.useState(true);
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-30 w-64 h-screen bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HealthAI
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {navItems
          .filter(
            (i) =>
              ![
                "symptoms",
                "risk",
                "image",
                "lab",
                "meds",
                "monitoring",
                "medtracker",
                "coach",
                "journal",
              ].includes(i.id),
          )
          .map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeView === item.id
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        <nav className="mt-6">
          {/* Diagnostic Tools group */}
          <div className="px-4 py-2">
            <button
              onClick={() => setDiagnosticsOpen((s) => !s)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left rounded hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🧰</span>
                <span className="font-medium">Diagnostic Tools</span>
              </div>
              <div className="text-gray-500">
                {diagnosticsOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </button>
            {diagnosticsOpen && (
              <div className="mt-2 space-y-1">
                {navItems
                  .filter((i) =>
                    ["symptoms", "risk", "image", "lab", "meds"].includes(i.id),
                  )
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 pl-8 pr-3 py-2 text-left rounded transition-colors ${
                        activeView === item.id
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Patient Features group */}
          <div className="px-4 py-2 mt-3">
            <button
              onClick={() => setPatientOpen((s) => !s)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left rounded hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🧑‍⚕️</span>
                <span className="font-medium">Patient Features</span>
              </div>
              <div className="text-gray-500">
                {patientOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </button>
            {patientOpen && (
              <div className="mt-2 space-y-1">
                {navItems
                  .filter((i) =>
                    ["monitoring", "medtracker", "coach", "journal"].includes(
                      i.id,
                    ),
                  )
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 pl-8 pr-3 py-2 text-left rounded transition-colors ${
                        activeView === item.id
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Other nav items (non-diagnostic, non-patient) */}
        </nav>
      </aside>
    </>
  );
}
