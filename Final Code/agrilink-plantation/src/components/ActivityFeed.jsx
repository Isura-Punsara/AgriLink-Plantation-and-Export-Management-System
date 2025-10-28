export default function ActivityFeed({ items = [] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
      <ul className="space-y-3">
        {items.length === 0 && (
          <li className="text-sm text-gray-500">No recent activity.</li>
        )}
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{it.title}</p>
              <p className="text-xs text-gray-500">{it.subtitle}</p>
            </div>
            <span className="text-xs text-gray-400">{it.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
