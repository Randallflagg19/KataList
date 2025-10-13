"use client";

import { useState } from "react";

type AddKataFormProps = {
  onAdd: (kata: {
    title: string;
    url: string;
    difficulty?: string;
    notes?: string;
  }) => void;
};

export default function AddKataForm({ onAdd }: AddKataFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      url,
      difficulty: difficulty || undefined,
      notes: notes || undefined,
    });
    setTitle("");
    setUrl("");
    setDifficulty("");
    setNotes("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
      >
        + Добавить новую кату
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-300 rounded-lg p-6 bg-white"
    >
      <h3 className="text-xl font-semibold mb-4">Новая ката</h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Название *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Sum of positive"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ссылка на Codewars *
          </label>
          <input
            id="url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.codewars.com/kata/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Сложность
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Не указана</option>
            <option value="8kyu">8 kyu</option>
            <option value="7kyu">7 kyu</option>
            <option value="6kyu">6 kyu</option>
            <option value="5kyu">5 kyu</option>
            <option value="4kyu">4 kyu</option>
            <option value="3kyu">3 kyu</option>
            <option value="2kyu">2 kyu</option>
            <option value="1kyu">1 kyu</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Заметки
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ваши заметки о задаче..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Добавить
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
