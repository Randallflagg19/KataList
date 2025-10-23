"use client";

type Kata = {
  id: string;
  title: string;
  url: string;
  difficulty: string | null;
  completed: boolean;
  notes: string | null;
  createdAt: string;
};

type KataCardProps = {
  kata: Kata;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
};

const difficultyColors: Record<string, string> = {
  "8kyu": "bg-gray-100 text-gray-800",
  "7kyu": "bg-blue-100 text-blue-800",
  "6kyu": "bg-green-100 text-green-800",
  "5kyu": "bg-yellow-100 text-yellow-800",
  "4kyu": "bg-orange-100 text-orange-800",
  "3kyu": "bg-red-100 text-red-800",
  "2kyu": "bg-purple-100 text-purple-800",
  "1kyu": "bg-pink-100 text-pink-800",
};

export default function KataCard({
  kata,
  onToggleComplete,
  onDelete,
  isSelected = false,
  onSelect,
  showSelection = false,
}: KataCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
        kata.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {showSelection && onSelect && (
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelect(kata.id, e.target.checked)}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2"
                  style={{
                    appearance: "none",
                    background: isSelected ? "#ea580c" : "transparent",
                    position: "relative",
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
            <input
              type="checkbox"
              checked={kata.completed}
              onChange={(e) => onToggleComplete(kata.id, e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <h3
              className={`font-semibold text-lg ${
                kata.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {kata.title}
            </h3>
          </div>

          <div className="flex gap-2 mb-2">
            {kata.difficulty && (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  difficultyColors[kata.difficulty] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {kata.difficulty}
              </span>
            )}
            <a
              href={kata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Открыть на Codewars →
            </a>
          </div>

          {kata.notes && (
            <p className="text-sm text-gray-600 mt-2">{kata.notes}</p>
          )}
        </div>

        <button
          onClick={() => onDelete(kata.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
