import React, { useState } from 'react';
import { Building2, Search, Plus, UserCheck, Shield } from 'lucide-react';
import { initialUsers } from '../data/seedData';

export const OrganizationsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = initialUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.organization.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Organizations & Users</h2>
          <p className="text-xs text-slate-500">Manage partner organizations, field coordinators, and auditors.</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>+ Add Organization</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, organization, email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Name & Email</th>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                </td>
                <td className="py-4 px-4 text-slate-700">{u.organization}</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">{u.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
