"use client";

import { useEffect, useState } from "react";
import KataCard from "@/components/KataCard";
import AddKataForm from "@/components/AddKataForm";

type Kata = {
  id: string;
  title: string;
  url: string;
  difficulty: string | null;
  completed: boolean;
  notes: string | null;
  createdAt: string;
};

export default function Home() {
  const [katas, setKatas] = useState<Kata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetchKatas();
  }, []);

  const fetchKatas = async () => {
    try {
      const response = await fetch("/api/katas");
      const data = await response.json();
      setKatas(data);
    } catch (error) {
      console.error("Failed to fetch katas:", error);
    } finally {
      setLoading(false);
    }
  };

  const addKata = async (kata: {
    title: string;
    url: string;
    difficulty?: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch("/api/katas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kata),
      });
      const newKata = await response.json();
      setKatas([newKata, ...katas]);
    } catch (error) {
      console.error("Failed to add kata:", error);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/katas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      setKatas(katas.map((k) => (k.id === id ? { ...k, completed } : k)));
    } catch (error) {
      console.error("Failed to update kata:", error);
    }
  };

  const deleteKata = async (id: string) => {
    if (!confirm("Удалить эту кату?")) return;

    try {
      await fetch(`/api/katas/${id}`, { method: "DELETE" });
      setKatas(katas.filter((k) => k.id !== id));
    } catch (error) {
      console.error("Failed to delete kata:", error);
    }
  };

  const filteredKatas = katas.filter((kata) => {
    if (filter === "active") return !kata.completed;
    if (filter === "completed") return kata.completed;
    return true;
  });

  const stats = {
    total: katas.length,
    completed: katas.filter((k) => k.completed).length,
    active: katas.filter((k) => !k.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">🥋 Мои Каты</h1>
          <p className="text-gray-600">
            Отслеживайте свой прогресс на Codewars
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Всего</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Решено</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">В процессе</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Все ({stats.total})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "active"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Активные ({stats.active})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Решённые ({stats.completed})
          </button>
        </div>

        {/* Add Kata Form */}
        <div className="mb-6">
          <AddKataForm onAdd={addKata} />
        </div>

        {/* Katas List */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Загрузка...</div>
        ) : filteredKatas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-2">
              {filter === "all"
                ? "Пока нет кат"
                : `Нет ${filter === "active" ? "активных" : "решённых"} кат`}
            </p>
            <p className="text-sm text-gray-500">
              Добавьте свою первую кату, чтобы начать!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredKatas.map((kata) => (
              <KataCard
                key={kata.id}
                kata={kata}
                onToggleComplete={toggleComplete}
                onDelete={deleteKata}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
