"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Схема валидации с Zod
const kataSchema = z.object({
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(100, "Слишком длинное название"),
  url: z.string().url("Некорректная ссылка").min(1, "Ссылка обязательна"),
  difficulty: z.string().optional(),
  notes: z.string().max(500, "Заметки слишком длинные").optional(),
});

type KataFormData = z.infer<typeof kataSchema>;

type AddKataFormProps = {
  onAdd: (kata: KataFormData) => void;
};

export default function AddKataForm({ onAdd }: AddKataFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<KataFormData>({
    resolver: zodResolver(kataSchema),
  });

  const onSubmit = async (data: KataFormData) => {
    try {
      await onAdd(data);
      reset(); // Очищаем форму
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add kata:", error);
    }
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
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 rounded-lg p-6 bg-white"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Новая ката</h3>

      <div className="space-y-4">
        {/* Название */}
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
            {...register("title")}
            placeholder="Например: Sum of positive"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* URL */}
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
            {...register("url")}
            placeholder="https://www.codewars.com/kata/..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
          )}
        </div>

        {/* Сложность */}
        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Сложность
          </label>
          <select
            id="difficulty"
            {...register("difficulty")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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

        {/* Заметки */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Заметки
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            placeholder="Ваши заметки о задаче..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
              errors.notes ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Добавляем..." : "Добавить"}
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
