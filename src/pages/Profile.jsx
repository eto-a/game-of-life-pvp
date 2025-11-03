import { useState, useEffect } from "react";
import { useMeQuery, useUpdateMeMutation } from "../features/profile/profile.api";

export default function Profile() {
  const { data, isLoading, refetch } = useMeQuery();
  const [updateMe, { isLoading: uLoading }] = useUpdateMeMutation();

  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (data?.profile) setNickname(data.profile.nickname || "");
  }, [data]);

  const onSave = async () => {
    await updateMe({ nickname }).unwrap();
    refetch();
  };

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container">
          <h1>Профиль</h1>
          {isLoading ? (
            <p className="muted mt-2">Загрузка…</p>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="card p-4">
                <div className="font-semibold">Данные</div>
                <div className="mt-3">
                  <label className="label">Никнейм</label>
                  <input
                    className="input"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <div className="mt-3">
                    <button className="btn btn-primary" onClick={onSave} disabled={uLoading}>
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="font-semibold">Статистика</div>
                <p className="muted text-sm mt-1">
                  Рейтинг: {data?.profile?.rating ?? "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
