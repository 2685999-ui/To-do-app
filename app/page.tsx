"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: string;
  archived: boolean;
  createdAt: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState<"topic" | "status" | "dueDate">("dueDate");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [topic, setTopic] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTopic, setEditTopic] = useState("");

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate || !topic) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate, topic }),
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setTopic("");
    loadTasks();
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadTasks();
  }

  async function archiveTask(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    loadTasks();
  }
  async function unarchiveTask(id: number) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ archived: false }),
  });
  loadTasks();
}

function startEdit(task: Task) {
  setEditingId(task.id);
  setEditTitle(task.title);
  setEditDescription(task.description);
  setEditDueDate(task.dueDate.slice(0, 10)); // format for date input
  setEditTopic(task.topic);
}

async function saveEdit(id: number) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
      topic: editTopic,
    }),
  });
  setEditingId(null);
  loadTasks();
}
  function isOverdue(task: Task) {
    return new Date(task.dueDate) < new Date() && task.status !== "Complete";
  }

  const visibleTasks = tasks
    .filter((t) => t.archived === showArchived)
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Todo App</h1>

      <form onSubmit={handleCreate} className="mb-8 space-y-3 border border-blue-200 p-4 rounded-lg">
        <h2 className="font-semibold">New Task</h2>
        <input
          className="border p-2 w-full rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="dueDate">Due Date</option>
            <option value="topic">Topic</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-3 py-1 rounded ${!showArchived ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Active
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-3 py-1 rounded ${showArchived ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleTasks.length === 0 && <p className="text-gray-500">No tasks here.</p>}
        {visibleTasks.map((task) => (
          <div key={task.id} className="border border-blue-200 rounded-lg p-4">
            {editingId === task.id ? (
  <div className="space-y-2">
    <input
      className="border p-2 w-full rounded"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
    />
    <textarea
      className="border p-2 w-full rounded"
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
    />
    <input
      className="border p-2 w-full rounded"
      type="date"
      value={editDueDate}
      onChange={(e) => setEditDueDate(e.target.value)}
    />
    <input
      className="border p-2 w-full rounded"
      value={editTopic}
      onChange={(e) => setEditTopic(e.target.value)}
    />
    <div className="space-x-2">
      <button
        onClick={() => saveEdit(task.id)}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Save
      </button>
      <button
        onClick={() => setEditingId(null)}
        className="text-gray-500 text-sm underline"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <div className="flex justify-between items-start">
    <div>
      <h3 className="font-semibold text-blue-900">
        {task.title}
        {isOverdue(task) && (
          <span className="ml-2 text-red-600 text-sm font-bold">OVERDUE</span>
        )}
      </h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500 mt-1">
        Topic: {task.topic} · Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
    </div>
    <div className="space-x-2 text-right">
      {!task.archived && (
        <button
          onClick={() => startEdit(task)}
          className="text-xs text-blue-600 underline"
        >
          Edit
        </button>
      )}
      {!task.archived ? (
        <button
          onClick={() => archiveTask(task.id)}
          className="text-xs text-gray-500 underline"
        >
          Archive
        </button>
      ) : (
        <button
          onClick={() => unarchiveTask(task.id)}
          className="text-xs text-blue-600 underline"
        >
          Unarchive
        </button>
      )}
    </div>
  </div>
)}

            {!task.archived && (
              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
                className="mt-2 border p-1 rounded text-sm"
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Complete">Complete</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}