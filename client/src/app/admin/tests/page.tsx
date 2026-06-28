"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getErrorMessage } from "@/lib/api";
import { Test, TraitDefinition } from "@/lib/types";

// An empty trait row used when the admin adds a new trait.
const emptyTrait: TraitDefinition = {
  name: "",
  description: "",
  lowInterpretation: "",
  moderateInterpretation: "",
  highInterpretation: "",
};

function AdminTestsContent() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // New-test form state.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("career");
  const [duration, setDuration] = useState(30);
  const [instructions, setInstructions] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [traits, setTraits] = useState<TraitDefinition[]>([{ ...emptyTrait }]);
  const [saving, setSaving] = useState(false);

  const loadTests = async () => {
    try {
      const response = await api.get("/admin/tests?page=1&limit=50");
      setTests(response.data.data.tests);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  // Update one field of one trait row.
  const updateTrait = (index: number, field: keyof TraitDefinition, value: string) => {
    setTraits((previous) => {
      const copy = [...previous];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTraitRow = () => {
    setTraits((previous) => [...previous, { ...emptyTrait }]);
  };

  const removeTraitRow = (index: number) => {
    setTraits((previous) => previous.filter((_, i) => i !== index));
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      // Only send traits that have a name.
      const cleanTraits = traits.filter((trait) => trait.name.trim() !== "");
      await api.post("/admin/tests", {
        title,
        description,
        type,
        durationInMinutes: duration,
        instructions,
        disclaimer,
        traits: cleanTraits,
      });
      setMessage("Test created.");
      // Reset the form and reload the list.
      setTitle("");
      setDescription("");
      setInstructions("");
      setDisclaimer("");
      setTraits([{ ...emptyTrait }]);
      loadTests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Flip a test's active state.
  const toggleActive = async (test: Test) => {
    try {
      await api.patch(`/admin/tests/${test._id}`, { isActive: !test.isActive });
      loadTests();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const inputClass =
    "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">Manage Tests</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

      {/* Existing tests */}
      <div className="mb-10">
        <h2 className="mb-3 font-semibold text-zinc-700">Existing tests</h2>
        {loading && <p className="text-zinc-500">Loading...</p>}
        <div className="flex flex-col gap-3">
          {tests.map((test) => (
            <div
              key={test._id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div>
                <p className="font-medium text-zinc-800">{test.title}</p>
                <p className="text-xs text-zinc-500">
                  {test.type} · {test.traits.length} traits ·{" "}
                  {test.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <button
                onClick={() => toggleActive(test)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                {test.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create test form */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-zinc-700">Create a new test</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-600">Title</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-600">Description</label>
            <textarea
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-zinc-600">Type</label>
              <select
                className={inputClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="career">career</option>
                <option value="personality">personality</option>
                <option value="aptitude">aptitude</option>
                <option value="behavioral">behavioral</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-600">
                Duration (minutes)
              </label>
              <input
                type="number"
                className={inputClass}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-600">Instructions</label>
            <textarea
              className={inputClass}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-600">Disclaimer</label>
            <textarea
              className={inputClass}
              value={disclaimer}
              onChange={(e) => setDisclaimer(e.target.value)}
              placeholder="Leave blank to use the default non-diagnostic disclaimer."
            />
          </div>

          {/* Traits editor */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Traits</label>
              <button
                type="button"
                onClick={addTraitRow}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Add trait
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {traits.map((trait, index) => (
                <div
                  key={index}
                  className="rounded-md border border-zinc-200 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      Trait {index + 1}
                    </span>
                    {traits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTraitRow(index)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Trait name (e.g. Technical)"
                    value={trait.name}
                    onChange={(e) => updateTrait(index, "name", e.target.value)}
                  />
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="High interpretation"
                    value={trait.highInterpretation}
                    onChange={(e) =>
                      updateTrait(index, "highInterpretation", e.target.value)
                    }
                  />
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Moderate interpretation"
                    value={trait.moderateInterpretation}
                    onChange={(e) =>
                      updateTrait(index, "moderateInterpretation", e.target.value)
                    }
                  />
                  <input
                    className={inputClass}
                    placeholder="Low interpretation"
                    value={trait.lowInterpretation}
                    onChange={(e) =>
                      updateTrait(index, "lowInterpretation", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create test"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminTestsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminTestsContent />
    </ProtectedRoute>
  );
}
