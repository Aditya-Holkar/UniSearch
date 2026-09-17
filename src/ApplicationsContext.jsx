/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

function applicationKey(params) { return `${params.name}||${params.country}`; }
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
const ApplicationsContext = createContext(null);
export const APPLICATION_STATUSES = ["Researching", "Preparing", "Ready to apply", "Applied", "Decision received"];
const DEFAULT_CHECKLIST = [
  { id: "requirements", label: "Check admission requirements", done: false },
  { id: "documents", label: "Prepare required documents", done: false },
  { id: "statement", label: "Prepare statement / SOP", done: false },
  { id: "application", label: "Submit application", done: false },
];

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(() => load("uni-applications", []).map((item) => ({
    ...item, status: item.status || "Researching", note: item.note || "", deadline: item.deadline || "",
    checklist: Array.isArray(item.checklist) && item.checklist.length ? item.checklist : DEFAULT_CHECKLIST.map((x) => ({ ...x })),
  })));
  useEffect(() => { localStorage.setItem("uni-applications", JSON.stringify(applications)); }, [applications]);
  const addApplication = useCallback((params) => setApplications((prev) => {
    const id = applicationKey(params); if (prev.some((item) => item.id === id)) return prev;
    return [...prev, { id, name: params.name, country: params.country, "state-province": params["state-province"], web_pages: params.web_pages, domains: params.domains, status: "Researching", note: "", deadline: "", checklist: DEFAULT_CHECKLIST.map((x) => ({ ...x })) }];
  }), []);
  const removeApplication = useCallback((id) => setApplications((prev) => prev.filter((item) => item.id !== id)), []);
  const updateApplication = useCallback((id, changes) => setApplications((prev) => prev.map((item) => item.id === id ? { ...item, ...changes } : item)), []);
  const toggleChecklist = useCallback((id, checklistId) => setApplications((prev) => prev.map((item) => item.id !== id ? item : { ...item, checklist: item.checklist.map((task) => task.id === checklistId ? { ...task, done: !task.done } : task) })), []);
  const isApplication = useCallback((params) => applications.some((item) => item.id === applicationKey(params)), [applications]);
  return <ApplicationsContext.Provider value={{ applications, addApplication, removeApplication, updateApplication, toggleChecklist, isApplication }}>{children}</ApplicationsContext.Provider>;
}
export function useApplications() { const ctx = useContext(ApplicationsContext); if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider"); return ctx; }
export { applicationKey };
