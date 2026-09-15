import React, { useState } from "react";
import { Users, X, UserPlus, Shield, CheckCircle2, Ban, Search } from "lucide-react";
import { MOCK_PERSONAS } from "../../data/mockClubs";
import { useToast } from "../../context/ToastContext";

export function ManageUsersModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [users, setUsers] = useState(
    MOCK_PERSONAS.map((p) => ({
      id: p.student_id,
      name: p.name,
      email: p.email,
      role: p.role,
      label: p.label,
      active: true,
    }))
  );

  const [query, setQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    student_id: "",
    role: "student",
  });

  if (!isOpen) return null;

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success("Role Updated", `User role adjusted to ${newRole.replace("_", " ")}.`);
  };

  const handleToggleActive = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = !u.active;
          toast.info(
            updated ? "Account Reactivated" : "Account Suspended",
            `${u.name} status updated.`
          );
          return { ...u, active: updated };
        }
        return u;
      })
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const created = {
      id: newUser.student_id || "USR-" + Math.floor(1000 + Math.random() * 9000),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      label: newUser.role.replace("_", " "),
      active: true,
    };

    setUsers((prev) => [created, ...prev]);
    toast.success("User Provisioned", `${created.name} added to institutional directory.`);
    setNewUser({ name: "", email: "", student_id: "", role: "student" });
    setShowAddUser(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-300 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Institutional User & Role Directory</h3>
              <p className="text-xs text-slate-300">Identity & Access Management (IAM)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500"
            />
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddUser ? "Hide Form" : "Add User"}</span>
          </button>
        </div>

        {/* Add User Drawer Form */}
        {showAddUser && (
          <form onSubmit={handleCreateUser} className="p-4 bg-sky-50/70 border-b border-sky-100 grid grid-cols-1 sm:grid-cols-4 gap-2.5 animate-in fade-in">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="student">Student</option>
              <option value="club_leader">Club Leader</option>
              <option value="committee_member">Committee Member</option>
              <option value="committee_head">Committee Head</option>
              <option value="dean_admin">Dean / Admin</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Save User
            </button>
          </form>
        )}

        {/* User Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2.5">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                u.active ? "bg-white border-slate-100 hover:border-sky-200" : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 text-xs truncate">{u.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    u.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {u.active ? "Active" : "Suspended"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{u.email} · ID: {u.id}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white text-xs px-2.5 py-1 text-slate-800 focus:border-sky-500"
                >
                  <option value="student">Student</option>
                  <option value="club_leader">Club Leader</option>
                  <option value="committee_member">Committee Reviewer</option>
                  <option value="committee_head">Committee Head</option>
                  <option value="dean_admin">Dean Admin</option>
                  <option value="system_admin">System Admin</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleToggleActive(u.id)}
                  title={u.active ? "Suspend Account" : "Activate Account"}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    u.active
                      ? "border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {u.active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
