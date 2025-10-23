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
  const [selectedKatas, setSelectedKatas] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  useEffect(() => {
    fetchKatas();
  }, []);

  const fetchKatas = async () => {
    try {
      const response = await fetch("/api/katas");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Проверяем что data является массивом
      if (Array.isArray(data)) {
        setKatas(data);
      } else {
        console.error("API returned non-array data:", data);
        setKatas([]);
      }
    } catch (error) {
      console.error("Failed to fetch katas:", error);
      setKatas([]); // Устанавливаем пустой массив при ошибке
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

  const handleSelectKata = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedKatas);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedKatas(newSelected);
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedKatas(new Set());
  };

  const deleteSelectedKatas = async () => {
    if (selectedKatas.size === 0) return;

    const count = selectedKatas.size;
    if (
      !confirm(
        `Удалить ${count} ${count === 1 ? "кату" : count < 5 ? "каты" : "кат"}?`
      )
    )
      return;

    try {
      // Создаём API endpoint для массового удаления
      const response = await fetch("/api/katas/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedKatas) }),
      });

      if (response.ok) {
        setKatas(katas.filter((k) => !selectedKatas.has(k.id)));
        setSelectedKatas(new Set());
        setBulkMode(false);
      } else {
        throw new Error("Failed to delete katas");
      }
    } catch (error) {
      console.error("Failed to delete katas:", error);
      alert("Ошибка при удалении кат");
    }
  };

  const filteredKatas = Array.isArray(katas)
    ? katas.filter((kata) => {
        if (filter === "active") return !kata.completed;
        if (filter === "completed") return kata.completed;
        return true;
      })
    : [];

  const stats = {
    total: Array.isArray(katas) ? katas.length : 0,
    completed: Array.isArray(katas)
      ? katas.filter((k) => k.completed).length
      : 0,
    active: Array.isArray(katas) ? katas.filter((k) => !k.completed).length : 0,
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

        {/* Filter and Bulk Actions */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <div className="flex gap-2">
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

          <div className="flex gap-2 ml-auto">
            <button
              onClick={toggleBulkMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                bulkMode
                  ? "bg-orange-600 text-white"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              {bulkMode ? "Отменить выбор" : "Выбрать каты"}
            </button>

            {bulkMode && selectedKatas.size > 0 && (
              <button
                onClick={deleteSelectedKatas}
                className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Удалить выбранные ({selectedKatas.size})
              </button>
            )}
          </div>
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
                isSelected={selectedKatas.has(kata.id)}
                onSelect={handleSelectKata}
                showSelection={bulkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
