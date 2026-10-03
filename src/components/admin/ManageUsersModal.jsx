import React, { useEffect, useState } from "react";
import { Users, X, UserPlus, Ban, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { api } from "../../lib/api";

export function ManageUsersModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", student_id: "", role: "student" });

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.admin
      .listCampusUsers()
      .then((rows) => setUsers(Array.isArray(rows) ? rows : []))
      .catch((err) => toast.error(err.message || "Could not load the campus directory."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await api.admin.updateCampusUser(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast.success("Role updated", `${updated.name} is now ${newRole.replace(/_/g, " ")}.`);
    } catch (err) {
      toast.error(err.message || "Could not change that role.");
    }
  };

  const handleToggleActive = async (person) => {
    try {
      const on = Boolean(person.is_active ?? person.active);
      const updated = await api.admin.updateCampusUser(person.id, { is_active: !on });
      setUsers((prev) => prev.map((u) => (u.id === person.id ? updated : u)));
      const nowOn = updated.is_active ?? updated.active;
      toast.info(nowOn ? "Account reactivated" : "Account suspended", person.name);
    } catch (err) {
      toast.error(err.message || "Could not update that account.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const created = await api.admin.createCampusUser(newUser);
      setUsers((prev) => [created, ...prev]);
      toast.success(
        "Person added",
        created.temporary_password
          ? `${created.name} can sign in. Temporary password: ${created.temporary_password}`
          : `${created.name} is on this campus directory.`
      );
      setNewUser({ name: "", email: "", student_id: "", role: "student" });
      setShowAddUser(false);
    } catch (err) {
      toast.error(err.message || "Could not add that person.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const hay = `${u.name || ""} ${u.email || ""} ${u.role || ""}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-sky-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Campus directory</h3>
              <p className="text-xs text-slate-300">People who may sign in at this licensed institution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-white/80 hover:bg-white/20" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddUser ? "Hide form" : "Add person"}</span>
          </button>
        </div>

        {showAddUser && (
          <form onSubmit={handleCreateUser} className="p-4 bg-sky-50/70 border-b border-sky-100 grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="text"
              required
              placeholder="Full name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs"
            />
            <input
              type="email"
              required
              placeholder="Licensed campus email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs"
            >
              <option value="student">Student</option>
              <option value="club_leader">Club Leader</option>
              <option value="committee_head">Committee Head</option>
              <option value="staff">Staff / Lecturer</option>
              <option value="system_admin">Campus admin</option>
            </select>
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
              Save
            </button>
          </form>
        )}

        <div className="p-6 overflow-y-auto flex-1 space-y-2.5">
          {loading && <p className="text-xs text-slate-500">Loading directory…</p>}
          {!loading && filteredUsers.length === 0 && (
            <p className="text-xs text-slate-500">No people match that search.</p>
          )}
          {filteredUsers.map((u) => {
            const on = u.is_active ?? u.active;
            return (
              <div
                key={u.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  on ? "bg-white border-slate-100" : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-xs truncate">{u.name}</p>
                    <span className={`text-[10px] font-bold px-2 rounded-full ${on ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {on ? "Active" : "Suspended"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white text-xs px-2.5 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="club_leader">Club Leader</option>
                    <option value="committee_head">Committee Head</option>
                    <option value="staff">Staff / Lecturer</option>
                    <option value="system_admin">Campus admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(u)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                  >
                    {on ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
